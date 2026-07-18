import os
from typing import Annotated, Optional
from pydantic import BaseModel
from langchain_openrouter import ChatOpenRouter
from langchain_core.messages import AnyMessage, SystemMessage, HumanMessage, AIMessage
from langgraph.graph import add_messages, StateGraph, START , END
from langgraph.prebuilt import ToolNode , tools_condition
from langgraph.checkpoint.memory import InMemorySaver
from backend.sys_prompt import system_prompt
from backend.tools import web_search, generated_google_map, calculator, search_hotel

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

def clean_json_text(text: str) -> str:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()
