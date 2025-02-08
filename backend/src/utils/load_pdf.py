from langchain_community.document_loaders import PDFPlumberLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def chunk_text(filename):
    loader = PDFPlumberLoader(filename)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 1200,
        chunk_overlap  = 300,
        length_function = len,
    )
    docs = loader.lazy_load()
    chunks = text_splitter.split_documents(docs)
    return chunks

