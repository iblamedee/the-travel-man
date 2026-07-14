from dotenv import load_dotenv
import os 
load_dotenv(override=True)
import asyncio
from langchain_openrouter import ChatOpenRouter
from pydantic import BaseModel
from typing import Annotated
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, AIMessage
from langgraph.graph import add_messages, StateGraph, START , END
from tools import web_search, generated_google_map
from langgraph.prebuilt import ToolNode , tools_condition
from langgraph.checkpoint.memory import  InMemorySaver
client = ChatOpenRouter(
    model= "tencent/hy3:free",
    base_url="https://openrouter.ai/api/v1",
    api_key = os.getenv("OPENAI_API_KEY")
    )


class State(BaseModel):
    messages: Annotated[list[AnyMessage], add_messages] = []

tools = [web_search, generated_google_map]
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
            """You are a nonchalent helpful assistant. 

            1. Fact Checking: ALWAYS use the {web_search} tool to verify facts, current events, movie release dates, or pop culture facts. Do not answer factual questions from memory.
            2. Math: ONLY use the {add_numbers} tool IF the user explicitly asks a math-related question.
            3. Directions & Routing: NEVER calculate distances manually and NEVER use web search to find driving distances or travel times. 
            4. Map Links: If a user asks for directions, a route, or the distance to a location, ALWAYS use the {generate_google_maps_link} tool. 
            5. Live Location: When using {generate_google_maps_link}, provide the `destination`. ONLY provide a `start_location` if the user explicitly names one in their prompt. Otherwise, leave it completely blank so the map defaults to their live GPS location.
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