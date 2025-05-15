import logger
from neo4j import AsyncGraphDatabase
import os
from dotenv import load_dotenv
import uuid
import logging
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from llm.get_llm import get_embedding_function
import smtplib
from email.mime.text import MIMEText

MODEL_NAME = "gpt-4o-mini"

load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    logger.error("❌❌ OPENAI_API_KEY is missing. Environment file may not have loaded.")


# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def summarize_chunk(chunk_content):
    """
    Tóm tắt nội dung của một chunk sử dụng model gpt-4o-mini.

    :param chunk_content: Nội dung của chunk cần tóm tắt (str)
    :return: Kết quả tóm tắt (str)
    """

    llm = ChatOpenAI(model_name=MODEL_NAME, temperature=0.3)

    prompt_template = PromptTemplate(
        input_variables=["chunk"],
        template="""
        Hãy tóm tắt nội dung sau đây thành một đoạn ngắn gọn và dễ hiểu:

        Nội dung: {chunk}

        Tóm tắt:
        """
    )

    summarize_chain = prompt_template | llm

    summary_message = summarize_chain.invoke({"chunk": chunk_content}) # Lưu kết quả invoke vào biến summary_message
    summary_text = summary_message.content # Lấy nội dung text từ AIMessage

    return summary_text.strip() # Gọi strip() trên summary_text

class Neo4jClient:
    def __init__(self, uri=None, user=None, password=None):
        self._uri = uri or os.environ.get("NEO4J_URI", "bolt://localhost:7687")
        self._user = user or os.environ.get("NEO4J_USER", "neo4j")
        self._password = password or os.environ.get("NEO4J_PASSWORD", "test")
        self._driver = AsyncGraphDatabase.driver(self._uri, auth=(self._user, self._password))
        logger.info("Connected to Neo4j (Async)")

    async def close(self):
        if self._driver:
            await self._driver.close()
            logger.info("Neo4j connection closed (Async)")

    async def run_query(self, query, parameters=None):
        async with self._driver.session() as session:
            result = await session.run(query, parameters)
            records = []
            async for record in result:
                records.append(record.data())
        return records

    async def create_file_with_chunks(self, filename, chunks,link, type_document):
        file_id = f"{filename}_{uuid.uuid4()}"
        
        async with self._driver.session() as session:
            await session.write_transaction(self._create_file_and_chunks_tx, file_id, filename, chunks, link, type_document)
        
        logger.info(f"Created File node with file_id: {file_id}")
        return file_id

    @staticmethod
    async def _create_file_and_chunks_tx(tx, file_id, filename, chunks, link="demo_link", type_document="File" ):
        # Create the File node
        result = await tx.run("""
        MATCH (f:File {link: $link})
        RETURN f
        """, link=link)
        existing_file = await result.single()
        
        # If the link exists, skip the creation
        if existing_file:
            logger.info(f"File with link '{link}' already exists. Skipping creation.")
            return False  
        await tx.run("""
        CREATE (f:File {
            file_id: $file_id,
            filename: $filename,
            link: $link,
            upload_date: toString(datetime({timezone: $timezone})),
            type_document: $type_document
        })
        """, file_id=file_id, filename=filename, link=link, type_document=type_document, timezone='UTC')
        
        embedding_function = get_embedding_function()

        prev_chunk_id = None
        for chunk in chunks:
            page_number = chunk.metadata['page']
            c_id = f"{filename}+_{uuid.uuid4()}"
            text = chunk.page_content # LƯU Ý: Biến này là full text
            sumary_text = summarize_chunk(chunk.page_content) # Biến này là bản tóm tắt
            content_embedding = embedding_function.embed_query(sumary_text) # Embedding của bản tóm tắt

            await tx.run("""
            MATCH (f:File {file_id: $file_id})
            CREATE (c:Chunk {
                chunk_id: $chunk_id,
                text: $text,  
                sumary_text: $sumary_text,     
                content_embedding: $content_embedding,
                page_number: $page_number
            })
            CREATE (f)-[:HAS_CHUNK]->(c)
            """,
            file_id=file_id, chunk_id=c_id, text=text, sumary_text=sumary_text, content_embedding=content_embedding, page_number=page_number)
            
            # Link the previous chunk
            if prev_chunk_id is not None:
                await tx.run("""
                MATCH (c1:Chunk {chunk_id: $prev_chunk_id}), (c2:Chunk {chunk_id: $chunk_id})
                CREATE (c1)-[:HAS_NEXT]->(c2)
                CREATE (c2)-[:HAS_PREV]->(c1)
                """, prev_chunk_id=prev_chunk_id, chunk_id=c_id)
            
            prev_chunk_id = c_id
        
        logger.info(f"Inserted {len(chunks)} chunks for file_id: {file_id}")
    
    async def create_web_with_chunks(self, chunks, type_document="Website"):
        # Generate a unique file_id using UUID4
        filename = chunks[0].metadata['title']
        link= chunks[0].metadata['source']
        file_id = f"{filename}_{uuid.uuid4()}"
        
        async with self._driver.session() as session:
            file_created = await session.write_transaction(self._create_web_and_chunks_tx, file_id, filename, chunks, link, type_document)
        
        if file_created:
            logger.info(f"Created File node with file_id: {file_id}")
        else:
            logger.info(f"File with link '{link}' already exists. No action taken.")
        return file_id, filename

    @staticmethod
    async def _create_web_and_chunks_tx(tx, file_id, filename, chunks, link="demo_link", type_document="Website" ):

        result = await tx.run("""
        MATCH (f:File {link: $link})
        RETURN f
        """, link=link)
        existing_file = await result.single()
        
        # If the link exists, skip the creation
        if existing_file:
            logger.info(f"File with link '{link}' already exists. Skipping creation.")
            return
        # Create the File node
        await tx.run("""
                CREATE (f:File {
                    file_id: $file_id,
                    filename: $filename,
                    link: $link,
                    upload_date: toString(datetime({timezone: $timezone})),
                    type_document: $type_document
                })
                """, file_id=file_id, filename=filename, link=link, type_document=type_document, timezone='UTC')
                        
        embedding_function = get_embedding_function()

        prev_chunk_id = None
        for chunk in chunks:
            c_id = f"{filename} ++_{uuid.uuid4()} "
            text = chunk.page_content
            sumary_text = summarize_chunk(chunk.page_content)
            content_embedding = embedding_function.embed_query(sumary_text) # Embedding của bản tóm tắt

            await tx.run("""
            MATCH (f:File {file_id: $file_id})
            CREATE (c:Chunk {
                chunk_id: $chunk_id,
                text: $text,  
                sumary_text: $sumary_text,       
                content_embedding: $content_embedding
            })
            CREATE (f)-[:HAS_CHUNK]->(c)
            """, file_id=file_id, chunk_id=c_id, text=text, sumary_text=sumary_text, content_embedding=content_embedding)
            
            # Link the previous chunk
            if prev_chunk_id is not None:
                await tx.run("""
                MATCH (c1:Chunk {chunk_id: $prev_chunk_id}), (c2:Chunk {chunk_id: $chunk_id})
                CREATE (c1)-[:HAS_NEXT]->(c2)
                CREATE (c2)-[:HAS_PREV]->(c1)
                """, prev_chunk_id=prev_chunk_id, chunk_id=c_id)
            
            prev_chunk_id = c_id
        
        logger.info(f"Inserted {len(chunks)} chunks for file_id: {file_id}")

    async def list_files(self):
        query = """
        MATCH (f:File) 
        RETURN f.file_id as file_id, f.filename as filename, f.upload_date as upload_date, f.link as link, f.type_document as type_document
        ORDER BY f.upload_date DESC
        """
        files = await self.run_query(query)

        logger.info(f"Retrieved {len(files)} files")
        return files

    async def get_chunks_by_file(self, file_id):
        query = """
        MATCH (f:File {file_id: $file_id})-[:HAS_CHUNK]->(c:Chunk)
        RETURN c.chunk_id as chunk_id, c.text as text, c.order as order, c.page_number as page_number
        ORDER BY c.order ASC
        """
        chunks = await self.run_query(query, {"file_id": file_id})
        logger.info(f"Retrieved {len(chunks)} chunks for file_id: {file_id}")
        return chunks

    async def update_chunk_text(self, file_id: str, chunk_id: str, new_text: str):
        query = """
        MATCH (f:File {file_id: $file_id})-[:HAS_CHUNK]->(c:Chunk {chunk_id: $chunk_id})
        SET c.text = $text
        RETURN c.chunk_id AS chunk_id, c.text AS text, c.order AS order, c.page_number AS page_number
        """
        parameters = {
            "file_id": file_id,
            "chunk_id": chunk_id,
            "text": new_text
        }

        try:
            result = await self.run_query(query, parameters)
            if not result:
                return None
            logger.info(f"Updated chunk_id: {chunk_id} for file_id: {file_id}")
            return result[0]
        except Exception as e:
            logger.error(f"Error in update_chunk_text: {e}")
            raise e

    async def delete_file(self, file_id):
        query = """
        MATCH (f:File {file_id: $file_id})-[:HAS_CHUNK]->(c:Chunk)
        DETACH DELETE c, f
        RETURN 1
        """
        records = await self.run_query(query, {"file_id": file_id})
        if len(records) == 0:
            return 0
        return 1
