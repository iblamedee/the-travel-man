from langchain.tools import tool
from tavily import AsyncTavilyClient
from dotenv import load_dotenv
import os
load_dotenv(override=True)
from typing import Optional

import urllib.parse

tavily_client = AsyncTavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
    )

# @tool(description="A tool that adds numbers.")
# def add_numbers(a: int, b: int):
#     return a + b




@tool(description="web search tool")
async def web_search(message:str):
    """Search the web for information."""
    web_response = await tavily_client.search(message, max_results=3) 
    return str(web_response)



# @tool(description="a tool for knowing distance")
# async def distance_map(cordinates: str):
#     """use the cordinates and tell the distance and time to reach there"""

#     try:
#         start_str, end_str = cordinates.split("|")
#         start_lon, start_lat = float(start_str.split(",")[0], start_str.split(",")[1])
#         end_lon, end_lat = float(end_str.split(",")[0], end_str.split(",")[0])
#     except Exception as e:
#         return "Error: invalid cordinates. please check your cordinates"
    
#     api_key = os.getenv("MAP_SERVER_API_KEY")
#     if not api_key:
#         return "api key not found , please add your api key "
    

#     url = "https://api.openrouteservice.org/v2/directions/driving-car"
#     headers = {
#         "Authorization": api_key,
#         "Content-type": "application/json"
#     }
#     body = {
#         "coordinates": [[start_lon, start_lat],[end_lon, end_lat]]
#     }

#     async with aiohttp.ClientSession() as session:
#         async with session.post(url, headers, body) as response:
#             if response.status==200:
#                 data = await response.json()



#                 summary = data["features"][0]["properties"]["summary"]
#                 distance_km = summary["distance"] / 1000
#                 time_hr = summary["duration"] / 3600

#                 return f"Distance: {distance_km:2f}km and duration is {time_hr}hr"
#             else:
#                 return f"API error "



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
