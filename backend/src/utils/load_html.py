from langchain_community.document_loaders import RecursiveUrlLoader
import re
from langchain.text_splitter import RecursiveCharacterTextSplitter
from bs4 import BeautifulSoup
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


def bs4_extractor(html: str) -> str:
    """
    Extracts content from HTML using BeautifulSoup with multiple fallback selectors.
    Tries common content container selectors before raising an exception.
    """
    try:
        soup = BeautifulSoup(html, "html.parser")

        # List of common content container selectors to try
        selectors = [
            {'class': 'news-detail'},  # Original selector
            {'class': 'article-content'},
            {'class': 'post-content'},
            {'class': 'entry-content'},
            {'id': 'content'},
            {'role': 'article'},
            {'itemprop': 'articleBody'}
        ]

        # Try each selector until finding content
        for selector in selectors:
            target_element = soup.find(**selector)
            if target_element:
                text = target_element.get_text(separator=" ", strip=True)
                cleaned_text = re.sub(r'\\s+', ' ', text)
                return cleaned_text

        # Fallback to body if no selectors match
        body = soup.find('body')
        if body:
            text = body.get_text(separator=" ", strip=True)
            return re.sub(r'\\s+', ' ', text)

        raise ValueError("Could not find any content containers in the HTML")
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