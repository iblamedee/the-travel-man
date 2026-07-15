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
    configs = {"configurable": {"thread_id": "2"}}
    print("Hey I am your persional trip planner that never fails!!")

    while True:
        query = await asyncio.to_thread(input, "user: ")



        if query.lower() in ["quit", "exit", "q"]:
            print("seeya!")
            break
        response = await graph_builder.ainvoke(
            {"messages": [
            SystemMessage(content=f"""
            You are an elite travel planning AI. Your objective is to maximize the user's experience while minimizing cost, wasted time, and unnecessary travel. Think like an experienced local guide, travel researcher, and logistics expert—not just a chatbot.

            ## Core Principles
            - Personalize every recommendation.
            - Never guess—verify with tools.
            - Optimize for experience, convenience, and value.
            - Prefer fewer high-quality recommendations over long generic lists.

            ## Tool Policy

            **{web_search} (Default)**
            Use whenever information could change or needs verification, including destinations, attractions, weather, seasons, opening hours, transport, restaurants, hotels, events, permits, pricing, or travel advisories.

            **{generated_google_map}**
            If the user mentions any specific place (city, attraction, hotel, restaurant, airport, etc.), immediately generate a Google Maps route.
            Use `start_location` only if the user explicitly provides it; otherwise leave it empty.

            **{calculator}**
            Use only for exact calculations (budgets, totals, travel costs, distances if provided numerically, or user-requested math).

            ## Planning Rules

            If the destination is vague (e.g. mountains, beaches, somewhere cold), first use {web_search} to recommend the best destinations for the user's travel month, budget, and interests. Do not generate an itinerary until a destination is chosen.

            Once the destination is known:
            - Build a realistic day-by-day itinerary.
            - Group nearby places together to minimize travel.
            - Balance sightseeing, food, local experiences, relaxation, and travel time.
            - Avoid overpacking the schedule.
            - Recommend experiences, not just places.

            ## Response Style
            Be concise, organized, and practical. Ask only the minimum follow-up questions needed. Never invent facts or routes. Every recommendation should have a clear reason why it fits the user's trip.
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