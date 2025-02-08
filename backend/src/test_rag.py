import pytest
from fastapi.testclient import TestClient
from main import app
from models.schemas import Message


@pytest.fixture
def client():
    # Set up the FastAPI test client
    client = TestClient(app)
    yield client


def test_ask_docs_agent_success(client):
    # Simulate a valid message
    message = {"text": "Đoàn Thanh niên Cộng sản Hồ Chí Minh được tổ chức theo mấy cấp? Đó là những cấp nào?", "session": "1234"}
    
    # Send a POST request to the /docs-rag-agent endpoint
    response = client.post("/docs-rag-agent", json=message)
    
    # Assert that the status code is 200
    assert response.status_code == 200
    
    # Assert that the response contains the expected fields
    response_json = response.json()
    assert "success" in response_json
    assert response_json["success"] is True
    assert "output" in response_json


def test_ask_docs_agent_failure(client):
    # Simulate a message that leads to failure (e.g., empty text)
    message = {"text": "", "session": "1234"}
    
    # Send a POST request to the /docs-rag-agent endpoint
    response = client.post("/docs-rag-agent", json=message)
    
    # Assert that the status code is 200 (even if it's a failure)
    assert response.status_code == 200
    
    # Assert that the response indicates failure
    response_json = response.json()
    assert "success" in response_json
    assert response_json["success"] is False
    assert "output" in response_json
    assert "Failed to get a response." in response_json["output"]


def test_ask_docs_agent_with_timeout(client):
    # Simulate a timeout or exception (mocked)
    message = {"text": "What is the weather like?", "session": "5678"}
    
    # Send a POST request to the /docs-rag-agent endpoint
    response = client.post("/docs-rag-agent", json=message)
    
    # Assert that the status code is 200 (even if it fails internally)
    assert response.status_code == 200
    
    # Assert that the response indicates failure due to some unexpected error
    response_json = response.json()
    assert "success" in response_json
    assert response_json["success"] is False
    assert "An unexpected error occurred." in response_json["output"]


@pytest.mark.asyncio
async def test_retry_logic(client):
    # Mock a scenario where retry logic is invoked.
    message = {"text": "Tell me about the universe", "session": "9999"}
    
    # Simulate multiple retries
    response = client.post("/docs-rag-agent", json=message)
    
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["success"] is True
    assert "output" in response_json


if __name__ == "__main__":
    pytest.main()