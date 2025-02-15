import os
import time 
import logging
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
        next_contents: [(node)-[:HAS_PREV]->(nextChunk) | nextChunk.text]
    } AS text,

    {
    data: node.id,
    filename: [(file)-[:HAS_CHUNK]->(node) | file.filename],
    link: [(file)-[:HAS_CHUNK]->(node) | file.link],
    start_page_number: node.page_number +1
    } AS metadata
    """,
    
)


chunk_retriever = neo4j_vector_index.as_retriever(search_type="similarity_score_threshold",
                                                    search_kwargs={'score_threshold': 0.7,
                                                                   'k': 2,})

def get_chunk_retriever():
    return chunk_retriever