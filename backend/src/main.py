# main.py

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Path, Body
from fastapi.middleware.cors import CORSMiddleware
from neo4j_client import Neo4jClient
import logging
from typing import Optional
from contextlib import asynccontextmanager
from agents.rag_agent import get_agent, ask_in_content
from utils.load_pdf import chunk_text
from models.schemas import Message, ChatResponse
from utils.async_utils import async_retry1
from asyncio import TimeoutError, wait_for
import uvicorn
from fastapi import status
from utils.load_html import get_content_from_url
import time
from pydantic import BaseModel


import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


neo4j_client = Neo4jClient()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Starting up and ensuring Neo4j connection is ready.")
    # Initialize any other resources here if needed
    yield
    # Shutdown actions
    logger.info("Shutting down and closing Neo4j connection.")
    await neo4j_client.close()

# Apply lifespan to the app
app = FastAPI(
    title="HaUI - Document Management & Chatbot API",
    description="Combined endpoints for document management and RAG chatbot",
    lifespan=lifespan
)

# Re-add middleware after reinitializing app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# Document Management Endpoints
# ============================

@app.post("/files", summary="Upload a new file")
async def create_file(
    file: UploadFile = File(...),
    link: str = Form(...),
    description: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
):
    """
    Upload a file, extract text, chunk it, and store in Neo4j.
    """
    try:
        if file.content_type not in ["application/pdf"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file type."
            )

        temp_dir = "/tmp"
        os.makedirs(temp_dir, exist_ok=True)
        temp_file_path = os.path.join(temp_dir, file.filename)

        with open(temp_file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        chunks = chunk_text(temp_file_path)

        metadata = {
            "link": link,
            "description": description,
            "tags": tags.split(",") if tags else [],
        }

        file_id = await neo4j_client.create_file_with_chunks(file.filename, chunks, link, type_document="File")

        os.remove(temp_file_path)

        return {
            "file_id": file_id,
            "filename": file.filename,
            "chunk_count": len(chunks),
            "link": link,
            "description": description,
            "tags": metadata["tags"],
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in create_file: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred."
        )

@app.post("/web-content", summary="Process web content and store in Neo4j")
async def create_web_content(
    url: str = Form(...),
    type_document: Optional[str] = Form("Website"),
):
    """
    Fetch web content from the given URL, chunk it, and store in Neo4j.
    """
    try:
        # Fetch content and chunk it
        chunks = get_content_from_url(url=url)
        print(len(chunks))
        if not chunks:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to extract content from the URL."
            )

        # Store in Neo4j
        file_id, filename = await neo4j_client.create_web_with_chunks(chunks, type_document=type_document)
        if file_id is None:
            # This means the file with the link already exists
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        return {
            "filename": filename,
            "message": "Content successfully processed and stored.",
            "file_id": file_id,
            "chunk_count": len(chunks),
            "type_document": type_document,
            "url": url,
        }
    except HTTPException as he:
        raise he  # Re-raise HTTP exceptions to be handled by FastAPI
    except Exception as e:
        logger.error(f"Unexpected error in create_web_content: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred."
        )

@app.get("/files", summary="List all uploaded files")
async def list_files():
    """
    Retrieve a list of all uploaded files.
    """
    try:
        files = await neo4j_client.list_files()
        return files
    except Exception as e:
        logger.error(f"Error in list_files: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/files/{file_id}/chunks", summary="Get chunks of a specific file")
async def get_file_chunks(file_id: str):
    """
    Retrieve chunks of a specific file by its ID.
    """
    try:
        chunks = await neo4j_client.get_chunks_by_file(file_id)
        if not chunks:
            raise HTTPException(status_code=404, detail="File not found")
        return chunks
    except Exception as e:
        logger.error(f"Error in get_file_chunks: {e}")
        raise HTTPException(status_code=500, detail=str(e))
@app.put(
    "/files/{file_id}/chunks/{chunk_id}",
    summary="Edit the text of a specific chunk of a file by its ID",
)
async def edit_file_chunk(
    file_id: str = Path(..., description="ID of the file"),
    chunk_id: str = Path(..., description="ID of the chunk to be edited"),
    new_text: str = Body(..., embed=True, description="New text for the chunk"),
):
    """
    Edit the text of a specific chunk of a file by its ID.
    """
    try:
        updated_chunk = await neo4j_client.update_chunk_text(file_id, chunk_id, new_text)
        if not updated_chunk:
            raise HTTPException(status_code=404, detail="Chunk not found")
        return updated_chunk
    except HTTPException as http_exc:
        # Re-raise HTTP exceptions
        raise http_exc
    except Exception as e:
        logger.error(f"Error in edit_file_chunk: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/files/{file_id}", summary="Delete a specific file")
async def delete_file(file_id: str):
    """
    Delete a specific file by its ID.
    """
    try:
        # Validate file_id as shown above
        success = await neo4j_client.delete_file(file_id)
        if not success:
            raise HTTPException(status_code=404, detail="File not found.")
        return {"message": f"File {file_id} deleted successfully."}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error in delete_file: {e}")
        raise HTTPException(status_code=500, detail="Internal server error.")


# ============================
# Chatbot Endpoints
# ============================

class AskInContentRequest(BaseModel):
    question: str
    context: str

class AskInContentResponse(BaseModel):
    answer: str

@async_retry1(max_retries=3, delay=1)
async def invoke_agent_with_retry(message: Message, timeout: int = 30):
    """
    Retry the agent if a tool fails to run. Helps with intermittent connection issues.
    """
    logger.info("Invoking chat agent with retry mechanism.")
    try:
        # Adding a timeout to ensure the query does not hang indefinitely
        response = await wait_for(
            get_agent().ainvoke(
                {"input": message.text},
                {"configurable": {"session_id": message.session}}
            ),
            timeout=timeout
        )
        return response
    except TimeoutError:
        logger.error(f"Query timed out after {timeout} seconds.")
        raise
    except Exception as e:
        logger.error(f"Error invoking agent: {e}")
        raise


@app.get("/", summary="API Status")
async def get_status():
    """
    Check the status of the API.
    """
    return {"status": "running"}


@app.post("/docs-rag-agent", response_model=ChatResponse, summary="Chat with the RAG Agent")
async def ask_docs_agent(message: Message) -> ChatResponse:
    """
    Interact with the RAG chatbot.
    """
    try:
        # Call the agent with retry mechanism
        start_time = time.time()
        query_response = await invoke_agent_with_retry(message)
        end_time = time.time()
        logger.info(f"Time taken to process the query: {end_time - start_time} seconds")

        if query_response is None:
            logger.error("invoke_agent_with_retry returned None after all retry attempts.")
            return ChatResponse(
                success=False,
                intermediate_steps=["No response from the agent."],
                output="Failed to get a response."
            )

        # Ensure 'intermediate_steps' exists in the response
        if "intermediate_steps" not in query_response:
            logger.error("Invalid response structure: 'intermediate_steps' key is missing.")
            query_response["intermediate_steps"] = ["No intermediate steps available."]

        # Process intermediate steps into strings if necessary
        try:
            query_response["intermediate_steps"] = [
                str(step) for step in query_response.get("intermediate_steps", [])
            ]
        except Exception as e:
            logger.error(f"Error processing 'intermediate_steps': {e}")
            query_response["intermediate_steps"] = ["Error processing intermediate steps."]

        # Construct the final response object
        print(query_response.get("output"))
        final_response = ChatResponse(
            success=True,
            intermediate_steps=query_response.get("intermediate_steps", []),
            output=query_response.get("output", "Hiện tại tôi đang không có câu trả lời cho câu hỏi bạn cần. Nếu bạn có thêm câu hỏi nào khác về Đoàn Thanh niên Cộng sản Hồ Chí Minh hoặc các nội dung liên quan, xin vui lòng cho tôi biết! ")
        )
        
        logger.info("Chat agent response successfully processed.")
        return final_response

    except Exception as e:
        logger.error(f"Unexpected error in ask_docs_agent: {e}")
        return ChatResponse(
            success=False,
            intermediate_steps=["An unexpected error occurred."],
            output=str(e)
        )
    

@app.post("/ask-in-content", response_model=AskInContentResponse, summary="Answer question based on provided context")
async def ask_with_context(request_data: AskInContentRequest = Body(...)):
    """
    Answer a question based on the provided context using the ask_in_content function.
    """
    try:
        start_time = time.time()
        answer = ask_in_content(question=request_data.question, context=request_data.context)
        end_time = time.time()
        logger.info(f"Time taken to process ask_in_content: {end_time - start_time} seconds")

        if not answer:
            logger.error("ask_in_content returned no answer.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to get an answer from the provided context."
            )
        
        return AskInContentResponse(answer=answer)

    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Unexpected error in ask_with_context: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)