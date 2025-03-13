import json
from pathlib import Path
from langchain.text_splitter import RecursiveCharacterTextSplitter

def metadata_func(record: dict, metadata: dict) -> dict:
    metadata["source"] = record.get("source")
    metadata["title"] = record.get("title")

    return metadata


file_path='/Users/admin/Working/thaibinh-chatbot/Crawl_web_data/doanthanhnien.json'
def get_chunk_with_json(file_path):

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 1200,
        chunk_overlap  = 300,
        length_function = len,
    )

    
    data = json.loads(Path(file_path).read_text())
    return data


get_chunk_with_json(file_path=file_path)