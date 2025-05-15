from langchain_community.document_loaders import PDFPlumberLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def chunk_text(filename):
    try:
        # Load PDF document
        loader = PDFPlumberLoader(filename)
        docs = list(loader.lazy_load())  # Đảm bảo thực thi generator

        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1200,
            chunk_overlap=300,
            length_function=len,
        )
        chunks = text_splitter.split_documents(docs)
        return chunks
    except Exception as e:
        print(f"Error processing PDF '{filename}': {e}")
        return []
