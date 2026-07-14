from dotenv import load_dotenv
import os 
load_dotenv(override=True)
import asyncio
from langchain_openrouter import ChatOpenRouter
from pydantic import BaseModel
from typing import Annotated
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage
from langgraph.graph import add_messages, StateGraph, START , END
from tools import web_search, generated_google_map, calculator
from langgraph.prebuilt import ToolNode , tools_condition
from langgraph.checkpoint.memory import  InMemorySaver
client = ChatOpenRouter(
    model= "tencent/hy3:free",
    base_url="https://openrouter.ai/api/v1",
    api_key = os.getenv("OPENAI_API_KEY")
    )


class State(BaseModel):
    messages: Annotated[list[AnyMessage], add_messages] = []

tools = [web_search, generated_google_map, calculator]
tools_node = ToolNode(tools=tools)

llm_with_tools = client.bind_tools(tools)

async def chat_tool(state: State):
    response = await llm_with_tools.ainvoke(state.messages)

    print(response.tool_calls)

    return {"messages": [response]}








###*agent*
checkpointor = InMemorySaver()

graph = StateGraph(State)
graph.add_node("chat", chat_tool)
graph.add_node("tools", tools_node)
graph.add_edge(START, "chat")
graph.add_conditional_edges("chat", tools_condition, {"tools":"tools", END:END,},)
graph.add_edge("tools", "chat")


graph_builder = graph.compile(checkpointer=checkpointor)


async def chat(): 
    configs = {"configurable": {"thread_id": "1"}}


    while True:
        query = await asyncio.to_thread(input, "user: ")



        if query.lower() in ["quit", "exit", "q"]:
            print("seeya!")
            break
        response = await graph_builder.ainvoke(
            {"messages": [
            SystemMessage(content=
            """You are a nonchalant but highly effective travel planner assistant. You have a relaxed, easygoing vibe, but your trip planning is meticulous. 

            1. Initial Destination Inquiry: If a user mentions a SPECIFIC, NAMED destination (e.g., "Dehradun", "Manali", "Taj Mahal"), ALWAYS use {generate_google_maps_link} immediately to give them a route link. IF the destination is vague (e.g., "mountains", "beach", "somewhere cold"), DO NOT use the map tool yet. Instead, casually ask them to clarify or narrow down exactly where they want to go.
            2. Smart Itinerary Building: Once the user provides a specific destination and their trip duration, build a comprehensive, day-by-day itinerary. Break down every single day into 'Morning', 'Afternoon', and 'Night' activities.
            3. Geographical Grouping (Crucial): You MUST group attractions logically. Use {web_search} to verify the locations of attractions and ensure that places scheduled on the same day are very close to each other. Do not plan a day where the user spends their whole time traveling between distant spots.
            4. Fact Checking & Research: ALWAYS use {web_search} to find top attractions, verify operating hours, or check current events. Do not make up facts or places from memory.
            5. Directions & Map Links: NEVER calculate distances manually. ALWAYS use {generate_google_maps_link} for routes to specific places. ONLY provide a `start_location` if the user explicitly names one. Otherwise, leave it completely blank so the map defaults to their live GPS location.
            6. Math: ONLY use the {calculator} tool if the user explicitly asks a math-related question or if you need to calculate the exact total cost of a trip to ensure it fits the user's budget.
            """
            ),
            HumanMessage(content=query)
            ]
            },
            config= configs,
        )

        ai_message = response["messages"][-1]
        
        # 6. Append the AI's reply to the history so it's remembered next turn
        print(f"AI: {ai_message.content}\n")








if __name__ == "__main__":
    result = asyncio.run(chat())
    if result:
        print(result["messages"][0].content)
    else: 
        print("\nsession finished")