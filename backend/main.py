import os
import uuid
import json
import asyncio
from typing import Optional, List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from langchain_core.messages import HumanMessage
from backend.database import init_db, get_db_connection
from backend.auth import (
    AuthRequest, AuthResponse, get_current_user,
    create_token, hash_password, verify_password
)
from backend.graph import graph_builder, clean_json_text

init_db()

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
    message: Optional[str] = None
    thread_id: Optional[str] = None
    messages: Optional[List[ChatMessageInput]] = None
    preferences: Optional[dict] = None

class ChatResponse(BaseModel):
    response: Optional[str] = None
    thread_id: Optional[str] = None
    text: Optional[str] = None

class MessageResponse(BaseModel):
    role: str
    content: str

@app.post("/api/auth/signup", response_model=AuthResponse)
async def signup_endpoint(req: AuthRequest):
    username = req.username.strip()
    password = req.password
    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters long")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
        
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT username FROM users WHERE username = ?", (username,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username already exists")
            
        hashed = hash_password(password)
        cursor.execute("INSERT INTO users (username, hashed_password) VALUES (?, ?)", (username, hashed))
        conn.commit()
    except Exception as e:
        if "UNIQUE" in str(e):
            raise HTTPException(status_code=400, detail="Username already exists")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        conn.close()
        
    token = create_token(username)
    return AuthResponse(token=token, username=username)

@app.post("/api/auth/login", response_model=AuthResponse)
async def login_endpoint(req: AuthRequest):
    username = req.username.strip()
    password = req.password
    
    if not username:
        raise HTTPException(status_code=400, detail="Username cannot be empty")
        
    token = create_token(username)
    return AuthResponse(token=token, username=username)

@app.get("/api/auth/me")
async def me_endpoint(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, current_user: str = Depends(get_current_user)):
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
async def history_endpoint(thread_id: str, current_user: str = Depends(get_current_user)):
    configs = {"configurable": {"thread_id": thread_id}}
    state = await graph_builder.aget_state(configs)
    
    if not state or not state.values or "messages" not in state.values:
        return []
        
    serialized = []
    for msg in state.values["messages"]:
        from langchain_core.messages import SystemMessage, AIMessage
        if isinstance(msg, HumanMessage):
            serialized.append(MessageResponse(role="user", content=msg.content))
        elif isinstance(msg, AIMessage):
            if msg.content:
                serialized.append(MessageResponse(role="assistant", content=msg.content))
        elif isinstance(msg, SystemMessage):
            serialized.append(MessageResponse(role="system", content=msg.content))
            
    return serialized

class ItineraryRequest(BaseModel):
    destination: str
    duration: int
    budget: str
    style: str
    preferences: Optional[dict] = None

@app.post("/api/itinerary/generate")
async def generate_itinerary_endpoint(request: ItineraryRequest, current_user: str = Depends(get_current_user)):
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
            from langchain_core.messages import SystemMessage
            from backend.graph import client
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

class ExploreDetailsRequest(BaseModel):
    destination: str

@app.post("/api/explore/details")
async def explore_details_endpoint(request: ExploreDetailsRequest, current_user: str = Depends(get_current_user)):
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
            from langchain_core.messages import SystemMessage
            from backend.graph import client
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

# Serve built frontend static files if they exist
dist_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "lyu", "dist")
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")
    
    # Catch-all route to serve the React SPA index.html for any non-API routes
    from fastapi.responses import FileResponse
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # If the path is an API route that wasn't caught, return a standard 404 instead of index.html
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        
        index_file = os.path.join(dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend not built")

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
        print("To run the CLI interface instead, use: python -m backend.main cli")
        uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
