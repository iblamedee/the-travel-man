from dotenv import load_dotenv
import os 
load_dotenv(override=True)
import asyncio
import uuid
import json
from typing import Annotated, Optional, List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from langchain_openrouter import ChatOpenRouter
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, AIMessage
from sys_prompt import system_prompt
from langgraph.graph import add_messages, StateGraph, START , END
from tools import web_search, generated_google_map, calculator, search_hotel
from langgraph.prebuilt import ToolNode , tools_condition
from langgraph.checkpoint.memory import InMemorySaver

client = ChatOpenRouter(
    model="tencent/hy3:free",
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENAI_API_KEY")
)

class State(BaseModel):
    messages: Annotated[list[AnyMessage], add_messages] = []
    preferences: Optional[dict] = None

tools = [web_search, generated_google_map, calculator, search_hotel]
tools_node = ToolNode(tools=tools)

llm_with_tools = client.bind_tools(tools)

async def chat_tool(state: State):
    # Prepend system prompt to the messages list before invoking LLM.
    # This keeps the system prompt active without cluttering state history checkpoints.
    sys_msg = system_prompt
    if state.preferences:
        p = state.preferences
        sys_msg += f"\n\nTake into account the user's travel preferences: " \
                   f"Home Airport/City: {p.get('homeAirport', 'Anywhere')}, " \
                   f"Travel Budget: {p.get('budget', 'Moderate')}, " \
                   f"Travel Style: {p.get('style', 'Balanced/Mixed')}, " \
                   f"Interests: {', '.join(p.get('interests', [])) if isinstance(p.get('interests'), list) else p.get('interests', 'None')}."
                   
    messages = [SystemMessage(content=sys_msg)] + state.messages
    response = await llm_with_tools.ainvoke(messages)
    print(response.tool_calls)
    return {"messages": [response]}

checkpointor = InMemorySaver()

graph = StateGraph(State)
graph.add_node("chat", chat_tool)
graph.add_node("tools", tools_node)
graph.add_edge(START, "chat")
graph.add_conditional_edges("chat", tools_condition, {"tools": "tools", END: END})
graph.add_edge("tools", "chat")

graph_builder = graph.compile(checkpointer=checkpointor)

# Helper to strip markdown block formatting from JSON responses
def clean_json_text(text: str) -> str:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

# --- FastAPI Application ---
app = FastAPI(
    title="Elite Travel Planner Agent API",
    description="REST API to interact with the Travel Planner Agent",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessageInput(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    # Old format (CLI / direct API)
    message: Optional[str] = None
    thread_id: Optional[str] = None
    
    # Frontend format
    messages: Optional[List[ChatMessageInput]] = None
    preferences: Optional[dict] = None

class ChatResponse(BaseModel):
    # Old format response
    response: Optional[str] = None
    thread_id: Optional[str] = None
    
    # Frontend format response
    text: Optional[str] = None

class MessageResponse(BaseModel):
    role: str
    content: str

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # Frontend format
    if request.messages:
        user_msg = request.messages[-1].text
        thread_id = request.thread_id or "lyu-default-session"
        configs = {"configurable": {"thread_id": thread_id}}
        
        inputs = {"messages": [HumanMessage(content=user_msg)]}
        if request.preferences:
            inputs["preferences"] = request.preferences
            
        try:
            response = await graph_builder.ainvoke(inputs, config=configs)
            ai_message = response["messages"][-1]
            return ChatResponse(text=ai_message.content)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    # Legacy / CLI format
    else:
        thread_id = request.thread_id or str(uuid.uuid4())
        configs = {"configurable": {"thread_id": thread_id}}
        user_msg = request.message or ""
        
        try:
            response = await graph_builder.ainvoke(
                {"messages": [HumanMessage(content=user_msg)]},
                config=configs
            )
            ai_message = response["messages"][-1]
            return ChatResponse(
                response=ai_message.content,
                thread_id=thread_id
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history/{thread_id}", response_model=List[MessageResponse])
async def history_endpoint(thread_id: str):
    configs = {"configurable": {"thread_id": thread_id}}
    state = await graph_builder.aget_state(configs)
    
    if not state or not state.values or "messages" not in state.values:
        return []
        
    serialized = []
    for msg in state.values["messages"]:
        if isinstance(msg, HumanMessage):
            serialized.append(MessageResponse(role="user", content=msg.content))
        elif isinstance(msg, AIMessage):
            if msg.content:
                serialized.append(MessageResponse(role="assistant", content=msg.content))
        elif isinstance(msg, SystemMessage):
            serialized.append(MessageResponse(role="system", content=msg.content))
            
    return serialized

# New endpoint for high-fidelity itinerary generation matching Lyu frontend requirements
class ItineraryRequest(BaseModel):
    destination: str
    duration: int
    budget: str
    style: str
    preferences: Optional[dict] = None

@app.post("/api/itinerary/generate")
async def generate_itinerary_endpoint(request: ItineraryRequest):
    sys_msg = (
        "You are Lyu, an elite AI Travel Partner. Create a beautiful, detailed, day-by-day "
        "itinerary for the given destination. Be creative, suggesting high-fidelity spots. "
        "For each day, include a theme and structured activities (Morning, Afternoon, Evening) "
        "with estimated costs, location names, and descriptions. "
        "Also suggest 2-3 suitable hotels/accommodations with price levels and descriptions, "
        "plus futuristic or smart flight/travel tips."
    )
    
    prompt = (
        f"Generate a travel itinerary for:\n"
        f"Destination: {request.destination}\n"
        f"Duration: {request.duration} days\n"
        f"Budget Level: {request.budget}\n"
        f"Travel Style: {request.style}\n"
    )
    if request.preferences:
        prompt += f"User Travel Preferences: {request.preferences}\n"
        
    prompt += (
        "\nUse the `search_hotel` tool to search for real hotels in the destination. "
        "Use `web_search` to verify destinations and attractions. "
        "Once done, you must respond ONLY with a single valid JSON object matching the following structure. "
        "Do not include markdown tags like ```json or any other text before/after the JSON:\n"
        "{\n"
        '  "destination": "...",\n'
        '  "country": "...",\n'
        '  "durationDays": integer,\n'
        '  "bestSeason": "...",\n'
        '  "budgetLevel": "...",\n'
        '  "description": "...",\n'
        '  "estimatedTotalCost": "...",\n'
        '  "days": [\n'
        "    {\n"
        '      "dayNumber": integer,\n'
        '      "theme": "...",\n'
        '      "activities": [\n'
        "        {\n"
        '          "time": "Morning/Afternoon/Evening",\n'
        '          "title": "...",\n'
        '          "description": "...",\n'
        '          "cost": "...",\n'
        '          "locationName": "..."\n'
        "        }\n"
        "      ]\n"
        "    }\n"
        "  ],\n"
        '  "hotels": [\n'
        "    {\n"
        '      "name": "...",\n'
        '      "description": "...",\n'
        '      "pricePerNight": "...",\n'
        '      "rating": "..."\n'
        "    }\n"
        "  ],\n"
        '  "flightTips": "..."\n'
        "}"
    )
    
    try:
        session_id = f"itinerary-gen-{uuid.uuid4()}"
        configs = {"configurable": {"thread_id": session_id}}
        
        response = await graph_builder.ainvoke(
            {"messages": [HumanMessage(content=prompt)]},
            config=configs
        )
        
        raw_text = response["messages"][-1].content
        cleaned = clean_json_text(raw_text)
        parsed = json.loads(cleaned)
        return parsed
    except Exception as e:
        print("Error generating itinerary via graph, trying fallback direct call...", e)
        try:
            messages = [
                SystemMessage(content=sys_msg),
                HumanMessage(content=prompt)
            ]
            res = await client.ainvoke(messages)
            cleaned = clean_json_text(res.content)
            return json.loads(cleaned)
        except Exception as fallback_err:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate valid itinerary: {str(e)} (Fallback: {str(fallback_err)})"
            )

# New endpoint for deep destination exploration details matching Lyu frontend requirements
class ExploreDetailsRequest(BaseModel):
    destination: str

@app.post("/api/explore/details")
async def explore_details_endpoint(request: ExploreDetailsRequest):
    sys_msg = "You are Lyu, providing top-tier, deep, secret insights for globetrotters. Deliver high-fidelity, creative details."
    
    prompt = (
        f'Provide deep, rich explore details for the destination: "{request.destination}".\n'
        f"Give 3 local secrets, 3 signature local foods, a cultural etiquette guide, and a list of 4 ultimate highlight locations to visit.\n"
        f"Use web_search to look up actual details if needed.\n"
        f"Respond with a single JSON object matching this schema. Do not include markdown tags or other text:\n"
        "{\n"
        f'  "destination": "{request.destination}",\n'
        '  "localSecrets": ["...", "...", "..."],\n'
        '  "signatureFoods": [\n'
        "    {\n"
        '      "name": "...",\n'
        '      "description": "..."\n'
        "    }\n"
        "  ],\n"
        '  "culturalEtiquette": ["...", "...", "..."],\n'
        '  "highlights": [\n'
        "    {\n"
        '      "name": "...",\n'
        '      "tagline": "...",\n'
        '      "description": "..."\n'
        "    }\n"
        "  ]\n"
        "}"
    )
    
    try:
        session_id = f"explore-gen-{uuid.uuid4()}"
        configs = {"configurable": {"thread_id": session_id}}
        
        response = await graph_builder.ainvoke(
            {"messages": [HumanMessage(content=prompt)]},
            config=configs
        )
        
        raw_text = response["messages"][-1].content
        cleaned = clean_json_text(raw_text)
        parsed = json.loads(cleaned)
        return parsed
    except Exception as e:
        print("Error getting explore details via graph, trying fallback direct call...", e)
        try:
            messages = [
                SystemMessage(content=sys_msg),
                HumanMessage(content=prompt)
            ]
            res = await client.ainvoke(messages)
            cleaned = clean_json_text(res.content)
            return json.loads(cleaned)
        except Exception as fallback_err:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate explore details: {str(e)} (Fallback: {str(fallback_err)})"
            )

# Serve built frontend static files if they exist (must be defined last so API routes match first)
dist_path = os.path.join(os.getcwd(), "lyu", "dist")
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")

# --- CLI Interface ---
async def chat(): 
    configs = {"configurable": {"thread_id": "2"}}
    print("Hey I am your personal trip planner that never fails!!")

    while True:
        query = await asyncio.to_thread(input, "user: ")

        if query.lower() in ["quit", "exit", "q"]:
            print("seeya!")
            break
        response = await graph_builder.ainvoke(
            {"messages": [HumanMessage(content=query)]},
            config=configs,
        )

        ai_message = response["messages"][-1]
        print(f"AI: {ai_message.content}\n")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "cli":
        result = asyncio.run(chat())
    else:
        import uvicorn
        print("Starting FastAPI REST API server...")
        print("To run the CLI interface instead, use: python main.py cli")
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)