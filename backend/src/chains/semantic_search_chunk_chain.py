import os
import sys
import time
import logging

# Add the project root directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
src_path = os.path.join(project_root, 'src')
if src_path not in sys.path:
    sys.path.insert(0, src_path)
from langchain_neo4j import Neo4jVector
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain_openai import ChatOpenAI
from langchain.prompts import (
    PromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
)
from dotenv import load_dotenv
from llm.get_llm import get_embedding_function, get_model_function
from llm.get_graph import get_graph_function

# Load environment variables from .env file
load_dotenv()

logger = logging.getLogger(__name__)

graph = get_graph_function()
embedding_func = get_embedding_function()
model = get_model_function()

neo4j_vector_index = Neo4jVector.from_existing_graph(
    embedding_func,
    graph=graph,
    index_name="chunk_content_embedding",
    node_label="Chunk",
    text_node_properties=["text"],
    embedding_node_property="content_embedding",
    
    retrieval_query="""
    RETURN score,
    {
        content: node.text,
        prev_content: [(node)-[:HAS_PREV]->(prevChunk) | prevChunk.text], // Lấy nội dung chunk trước đó
        next_content: [(nextChunk)-[:HAS_PREV]->(node) | nextChunk.text]  // Lấy nội dung chunk kế tiếp
    } AS text,

    {
    data: node.id,
    filename: [(file)-[:HAS_CHUNK]->(node) | file.filename],
    link: [(file)-[:HAS_CHUNK]->(node) | file.link],
    start_page_number: node.page_number +1
    } AS metadata
    """,
    # Lưu ý: Giả định rằng mối quan hệ (node)-[:HAS_PREV]->(prevChunk) có nghĩa là prevChunk đứng TRƯỚC node.
    # Và (nextChunk)-[:HAS_PREV]->(node) có nghĩa là nextChunk đứng SAU node (và trỏ về node bằng HAS_PREV).
    # Cần xác minh lại logic mối quan hệ trong cơ sở dữ liệu Neo4j nếu kết quả không như mong đợi.
    
)


chunk_retriever = neo4j_vector_index.as_retriever(search_type="similarity_score_threshold",
                                                    search_kwargs={'score_threshold': 0.5,
                                                                   'k': 2,})

print(chunk_retriever)

# Thêm đoạn mã để kiểm tra retriever
# try:
#     sample_query = "Có những loại giao tiếp văn hóa nào?"
#     print(f"\nĐang thực hiện truy vấn mẫu: '{sample_query}'")
#     retrieved_docs = chunk_retriever.invoke(sample_query)
#     print("\n--- Kết quả truy xuất --- ")
#     if retrieved_docs:
#         for i, doc in enumerate(retrieved_docs):
#             print(f"\n--- Document {i+1} ---")
#             print(f"Nội dung: {doc.page_content}")
#             print(f"Metadata: {doc.metadata}")
#     else:
#         print("Không tìm thấy tài liệu nào.")
#     print("--- Kết thúc kết quả truy xuất ---\n")
# except Exception as e:
#     print(f"Lỗi khi thực hiện truy vấn mẫu: {e}")

def get_chunk_retriever():
    return chunk_retriever