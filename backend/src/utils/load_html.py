from langchain_community.document_loaders import RecursiveUrlLoader
import re
from langchain_core.load import dumpd, dumps, load, loads
from langchain.text_splitter import RecursiveCharacterTextSplitter
from bs4 import BeautifulSoup
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def bs4_extractor(html: str) -> str:
    """
    Extracts content from HTML using BeautifulSoup. 
    Raises an exception if the expected elements are not found.
    """
    try:
        # Initialize BeautifulSoup with a valid parser
        soup = BeautifulSoup(html, "html.parser")

        # Find the first element with the class 'news-detail'
        target_element = soup.find(class_="news-detail")

        if target_element:
            # Extract text from the target element
            text = target_element.get_text(separator=' ', strip=True)
            # Replace multiple whitespace characters with a single space
            cleaned_text = re.sub(r'\s+', ' ', text)
            return cleaned_text
        else:
            raise ValueError("The HTML does not contain the required element with class 'news-detail'.")
    except Exception as e:
        logging.error(f"Error during extraction: {e}")
        raise

def get_content_from_url(url):
    """
    Fetches content from a URL, splits it into chunks, and raises an exception if the chunks are None or empty.
    """
    try:
        # Initialize the URL loader
        loader = RecursiveUrlLoader(
            url=url,
            max_depth=1,
            check_response_status=True,
            continue_on_failure=True,
            extractor=bs4_extractor,
        )

        # Initialize text splitter
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1200,
            chunk_overlap=300,
            length_function=len,
        )

        # Load documents
        docs = loader.load()
        if not docs:
            raise ValueError("No documents were loaded from the URL.")

        # Split into chunks
        chunks = text_splitter.split_documents(docs)
        if not chunks:
            raise ValueError("The document content could not be split into chunks.")

        return chunks
    except Exception as e:
        logging.error(f"Error during content processing: {e}")
        raise

# Example usage
if __name__ == "__main__":
    url = "https://doanthanhnien.vn/tin-tuc/cong-tac-giao-duc/gia-lai-nang-cao-ky-nang-nghiep-vu-cho-luc-luong-bao-cao-vien-can-bo-doan-chu-chot"

    try:
        docs = get_content_from_url(url)
        print(docs)
    except Exception as e:
        logging.error(f"An error occurred while processing the URL: {e}")