# HaUI - Chatbot Tài liệu Trường Đại học Công nghiệp Hà Nội

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Mô tả dự án

**HaUI** là một chatbot thông minh được thiết kế để cung cấp thông tin và trả lời các câu hỏi liên quan đến tài liệu của **Trường Đại học Công nghiệp Hà Nội**. Dự án này sử dụng kiến trúc **Retrieval-Augmented Generation (RAG)**, kết hợp sức mạnh của tìm kiếm ngữ nghĩa trên cơ sở dữ liệu tài liệu và khả năng tạo sinh ngôn ngữ tự nhiên của các mô hình ngôn ngữ lớn (LLM) để mang lại trải nghiệm hỏi đáp chính xác và hữu ích.

**Mục tiêu:**

- Cung cấp một công cụ tra cứu thông tin nhanh chóng và tiện lợi về các văn bản, quy định, điều lệ của Trường Đại học Công nghiệp Hà Nội.
- Hỗ trợ cán bộ, đoàn viên, hội viên, đội viên và những người quan tâm tìm hiểu về tổ chức và hoạt động của Trường Đại học Công nghiệp Hà Nội.
- Nâng cao hiệu quả công tác tuyên truyền, giáo dục của Trường Đại học Công nghiệp Hà Nội thông qua việc cung cấp thông tin dễ dàng tiếp cận.

## Tính năng chính

- **Hỏi đáp thông minh dựa trên tài liệu:** Trả lời câu hỏi của người dùng một cách chính xác dựa trên nội dung của các tài liệu Trường Đại học Công nghiệp Hà Nội đã được cung cấp.
- **Tìm kiếm ngữ nghĩa:** Sử dụng vector embeddings và Neo4j để tìm kiếm các đoạn văn bản liên quan nhất đến câu hỏi, ngay cả khi không có từ khóa chính xác.
- **Trích dẫn nguồn tham khảo:** Cung cấp thông tin về nguồn tài liệu (tên file, số trang, link) để người dùng có thể kiểm chứng tính xác thực của câu trả lời.
- **Quản lý tài liệu:**
  - Tải lên tài liệu PDF.
  - Thêm nội dung từ trang web thông qua URL hoặc file JSON.
  - Liệt kê, xem, chỉnh sửa, xóa tài liệu và các đoạn văn bản (chunks).
- **Lịch sử hội thoại:** Lưu trữ lịch sử trò chuyện để duy trì ngữ cảnh trong các phiên hỏi đáp.
- **API RESTful:** Cung cấp API mạnh mẽ được xây dựng bằng FastAPI để tích hợp dễ dàng vào các ứng dụng khác.
- **Khả năng mở rộng và tùy chỉnh:** Kiến trúc RAG linh hoạt, dễ dàng mở rộng thêm tài liệu và tùy chỉnh logic của chatbot.

## Công nghệ sử dụng

Dự án được xây dựng trên nền tảng công nghệ hiện đại, bao gồm:

- **Mô hình ngôn ngữ lớn (LLM):**
  - OpenAI API (gpt-4o-mini, gpt-3.5-turbo hoặc gpt-4 tùy cấu hình)
  - `langchain_openai`
- **Cơ sở dữ liệu Vector & Đồ thị:**
  - Neo4j
  - `langchain_neo4j`, `Neo4jVector`
- **Framework Backend:**
  - FastAPI
  - Uvicorn
- **Thư viện xử lý văn bản:**
  - Langchain
  - PDFPlumber
  - BeautifulSoup4
  - `RecursiveUrlLoader`, `JSONLoader`
  - `RecursiveCharacterTextSplitter`
- **Công cụ hỗ trợ:**
  - `.env`, `python-dotenv`
  - `requirements.txt`
  - `entrypoint.sh`
  - Logging, CORS Middleware, Asyncio

## Cài đặt và chạy dự án

Để cài đặt và chạy dự án Lyli trên máy cục bộ, bạn cần thực hiện các bước sau:

### Yêu cầu

- Python 3.8+
- Docker (nếu cần chạy Neo4j trong container)
- Tài khoản OpenAI và API key
- Tài khoản Qdrant (hoặc Neo4j AuraDB) và API key (nếu dùng Qdrant) - _Trong dự án này dùng Neo4j_

### Các bước cài đặt

1.  **Clone repository dự án:**

    ```bash
    git clone https://github.com/thanthienhai/QBADINH
    cd QBADINH
    ```

2.  **Tạo và kích hoạt môi trường ảo Python (khuyến nghị):**

    ```bash
    python -m venv venv
    source venv/bin/activate  # Trên Linux/macOS
    venv\Scripts\activate  # Trên Windows
    ```

3.  **Cài đặt các thư viện phụ thuộc:**

    ```bash
    cd backend/src
    pip install -r requirements.txt
    ```

4.  **Cấu hình biến môi trường:**

    - Sao chép file `.env.example` thành `.env`:
      ```bash
      cp .env.example .env
      ```
    - Mở file `.env` và điền các thông tin sau:
      - `OPENAI_API_KEY`: API key của bạn từ OpenAI.
      - `NEO4J_URI`: URI kết nối đến Neo4j (ví dụ: `bolt://localhost:7687` hoặc Neo4j AuraDB URI).
      - `NEO4J_USERNAME`: Username để kết nối Neo4j.
      - `NEO4J_PASSWORD`: Password để kết nối Neo4j.
      - `COLLECTION_NAME`: Tên collection.

5.  **Khởi động Neo4j:**

    - **Nếu bạn đã cài đặt Neo4j cục bộ:** Đảm bảo Neo4j server đang chạy.
    - **Nếu bạn muốn chạy Neo4j bằng Docker:**
      ```bash
      # Ví dụ lệnh chạy Neo4j Docker (tham khảo Docker Hub Neo4j)
      # docker run --publish=7474:7474 --publish=7687:7687 --env NEO4J_AUTH=neo4j/password neo4j:latest
      ```
      Thay `neo4j/password` bằng username và password bạn muốn sử dụng, và đảm bảo các port 7474 và 7687 không bị conflict.

6.  **Chạy ứng dụng Backend FastAPI:**

    ```bash
    cd backend/src
    bash entrypoint.sh
    ```

    Hoặc chạy trực tiếp bằng lệnh:

    ```bash
    cd backend/src
    uvicorn main:app --host 0.0.0.0 --port 8081 --reload
    ```

    Ứng dụng backend sẽ chạy tại địa chỉ `http://0.0.0.0:8081`.

## Hướng dẫn sử dụng API

API của Lyli cung cấp các endpoint sau:

### Quản lý tài liệu

- **`POST /files`**: Tải lên tài liệu PDF.
  - **Request body (multipart/form-data):**
    - `file`: File PDF (form file).
    - `link`: Link liên kết đến tài liệu (form field, string).
    - `description` (optional): Mô tả tài liệu (form field, string).
    - `tags` (optional): Danh sách tags, cách nhau bằng dấu phẩy (form field, string).
- **`POST /web-content`**: Thêm nội dung web từ URL.
  - **Request body (multipart/form-data):**
    - `url`: URL của trang web (form field, string).
    - `type_document` (optional): Loại tài liệu (mặc định "Website", form field, string).
- **`GET /files`**: Liệt kê tất cả tài liệu đã tải lên.
- **`GET /files/{file_id}/chunks`**: Lấy danh sách các đoạn văn bản (chunks) của một tài liệu cụ thể.
- **`PUT /files/{file_id}/chunks/{chunk_id}`**: Chỉnh sửa nội dung của một đoạn văn bản cụ thể.
  - **Request body (application/json):**
    - `new_text` (string): Nội dung văn bản mới.
- **`DELETE /files/{file_id}`**: Xóa một tài liệu cụ thể.

### Chatbot

- **`POST /docs-rag-agent`**: Gửi câu hỏi đến chatbot và nhận câu trả lời.
  - **Request body (application/json):**
    - `text` (string): Câu hỏi của người dùng.
    - `session` (string): ID phiên chat (để duy trì lịch sử hội thoại).
  - **Response body (application/json):**
    - `output` (string): Câu trả lời của chatbot.
    - `intermediate_steps` (list[string]): Các bước trung gian trong quá trình xử lý của agent (cho mục đích debug).
    - `success` (boolean): Trạng thái thành công/thất bại.

### Kiểm tra trạng thái API

- **`GET /`**: Kiểm tra trạng thái hoạt động của API.

**Ví dụ sử dụng (Python Requests):**

```python
import requests
import json

# Ví dụ gửi câu hỏi đến chatbot
url = "http://0.0.0.0:8081/docs-rag-agent"
headers = {'Content-type': 'application/json'}
data = {"text": "Trường Đại học Công nghiệp Hà Nội được thành lập khi nào?", "session": "user123"}

response = requests.post(url, data=json.dumps(data), headers=headers)

if response.status_code == 200:
    chat_response = response.json()
    print(chat_response['output'])
    print("Các bước trung gian:", chat_response['intermediate_steps'])
else:
    print(f"Lỗi: {response.status_code}")
    print(response.text)
```
