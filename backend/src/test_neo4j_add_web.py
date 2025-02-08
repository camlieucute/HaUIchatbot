import asyncio
from neo4j_client import Neo4jClient
from utils.load_html import get_content_from_url
import json

# Define the path to your JSON file
file_path = "/Users/admin/Working/thaibinh-chatbot/Crawl_web_data/doanthanhnien.json"

# Function to asynchronously load JSON data
async def load_json(file_path):
    loop = asyncio.get_event_loop()
    with open(file_path, 'r', encoding='utf-8') as file:
        data = await loop.run_in_executor(None, json.load, file)  # Load JSON asynchronously
    return data

# Main coroutine to process the data
async def main():
    # Load data from the JSON file
    data = await load_json(file_path)

    # Initialize Neo4j client
    neo4j = Neo4jClient()

    # Process URLs from the JSON data (assuming it's a list of URLs)
    for entry in data:
        url = entry.get("kwargs").get("metadata").get("source")  # Adjust based on your JSON structure
        if not url:
            continue  # Skip if URL is not present
        
        # Extract content and chunks
        chunks = get_content_from_url(url=url)
        
        # Store in Neo4j
        await neo4j.create_web_with_chunks(chunks, type_document="Website")

# Run the main coroutine
if __name__ == "__main__":
    asyncio.run(main())