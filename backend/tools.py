from langchain.tools import tool
from tavily import AsyncTavilyClient
from dotenv import load_dotenv
import os
load_dotenv(override=True)
from typing import Optional
import requests
import urllib.parse

tavily_client = AsyncTavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
    )


@tool(description="Helps in Mathmatical and numerical calculation, in short a agent calculator")
def calculator(a:float , b: float, operation:str):
    """Perform basic mathmatical calculation"""


    op = operation.lower()

    if op in ["add", "addition", "+"]:
        result = a + b
    elif op in ["sub", "subtraction", "subtract", "-"]:
        result = a - b
    elif op in ["multi", "multiply", "multiplication", "*"]:
        result = a * b

    elif op in ["divide", "division", "/", "div"]:
        if b == 0:
            return "Error: Division by zero is not mathematically defined."
        result = a / b

    else:
        return f"Error: Unknown operation '{operation}'. Please use 'add', 'subtract', 'multiply', or 'divide'."
    
    return f"the result of {a} {operation} {b} is {result}"




@tool(description="web search tool")
async def web_search(message:str):
    """Search the web for information."""
    web_response = await tavily_client.search(message, max_results=3) 
    return str(web_response)



@tool(description="Generates a clickable Google Maps link for directions. If the user does not specify a starting point, leave start_location blank to auto-fetch their GPS location.")
def generated_google_map(destination:str, start_location:Optional[str] = None):
    """Return a Google Map URL for the given destination"""


    safe_dest = urllib.parse.quote_plus(destination)


    if start_location:
        safe_start = urllib.parse.quote_plus(start_location)
        map_url =   f"https://www.google.com/maps/dir/?api=1&origin={safe_start}&destination={safe_dest}"

    else:
        map_url = f"https://www.google.com/maps/dir/?api=1&destination={safe_dest}"


    return f"Here are your  directions on Google Maps: {map_url}"



@tool(description= "list hotel and compare the prices of the hotels")
def search_hotel(destination:str, check_in:str, check_out:str, adult: int, children:int):
    """
    Returns a Google Hotels search link for the requested destination.
    """

    api_key = os.getenv("SERPAPI_API_KEY") or os.getenv("SERAPI_API_KEY")


    params = {
        "engine":"google_hotels",
        "q":destination,
        "check_in_date": check_in,
        "check_out_date": check_out,
        "adults": adult,
        "children": children,
        "currency": "INR",
        "api_key": api_key
    }


    try:
        response= requests.get("https://serpapi.com/search", params=params)
        data = response.json()


        result = []
        for hotel in data.get("properties", [])[:3]:
            name = hotel.get("name")


            hotel_info = f"🏨 **{name}**"
            if "prices" in hotel:
                for option in hotel["prices"][:3]:
                    site_name = option.get("source")
                    site_price = option.get("price")
                    hotel_info += f"\n - {site_name}: {site_price}"

            else:
                price = hotel.get("rate_per_night", {}).get("lowest")
                if price:
                    hotel_info += f"\n - Lowest price found: ₹{price}/per night"

            result.append(hotel_info)
        if result:
            return "Here are the top hotels i found:\n" + "\n".join(result)
        return "No prices found for those dates."
    
    except Exception as e:
        return f"failed to fatch hotel prices : {str(e)}"
