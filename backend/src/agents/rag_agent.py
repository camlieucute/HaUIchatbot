import logging
from langchain.agents import AgentExecutor, tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain_neo4j import Neo4jChatMessageHistory

from chains.semantic_search_chunk_chain import get_chunk_retriever

from tools.tools import get_customer_service_infor
from llm.get_llm import get_embedding_function, get_model_function
from llm.get_graph import get_graph_function
from langchain_core.runnables.history import RunnableWithMessageHistory


logger = logging.getLogger(__name__)
print("✅✅call agent step")

graph = get_graph_function()


@tool
def get_chunk_tool(question: str) -> str:
    """
    Tìm kiếm thông tin về 'Đoàn thanh niên, hội sinh viên'. 
    Đối với bất kỳ câu hỏi nào liên quan đến 'Đoàn thanh niên, hội sinh viên', hãy sử dụng công cụ này.
    """
    result = get_chunk_retriever().invoke(question)
    return result


@tool
def get_customer_service() -> str:
    """
    Khi người dùng hỏi hoặc khi bạn không thể trả lời câu hỏi của họ, hãy sử dụng công cụ này
    để lấy thông tin liên hệ với dịch vụ khách hàng.

    Ví dụ:
    "Tôi có thể liên hệ với dịch vụ khách hàng như thế nào?"
    """
    return get_customer_service_infor()


agent_tools = [

    get_chunk_tool,
    get_customer_service,
 
]


def get_memory(session_id):
    """
    Tạo bộ nhớ thoại liên quan đến phiên làm việc với `session_id` được chỉ định.
    
    Parameters:
        session_id (str): ID của phiên làm việc.

    Returns:
        Neo4jChatMessageHistory: Đối tượng lưu trữ lịch sử chatbot.
    """
    return Neo4jChatMessageHistory(session_id=session_id, graph=graph)


agent_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            1. Nhiệm vụ chính:
                • Trả lời các câu hỏi liên quan đến tổ chức, nhiệm vụ, quyền hạn và hoạt động của:
                    - Đoàn Thanh niên Cộng sản Hồ Chí Minh
                    - Hội Liên hiệp Thanh niên Việt Nam
                    - Đội Thiếu niên Tiền phong Hồ Chí Minh
                • Chỉ sử dụng thông tin từ tài liệu được cung cấp

            2. Quy tắc trả lời:
                • Sử dụng từ ngữ chính xác từ tài liệu gốc
                • Trả lời "Tôi không có thông tin này" nếu không tìm thấy trong tài liệu
                • Trích dẫn đầy đủ nội dung điều khoản liên quan
                • Chỉ sử dụng một tài liệu cho mỗi câu trả lời

            3. Định dạng:
                • Sử dụng ngôn ngữ trang trọng, rõ ràng
                • Trích dẫn nguồn theo format: [Tên file] - [Trang] - [**Link tham khảo**](Link)
                • Thêm gợi ý câu hỏi liên quan ở cuối

            4. Quy trình:
                • Sử dụng công cụ tìm kiếm để truy vấn thông tin
                • Xử lý kết quả và tìm kiếm lại nếu cần
                • Chuyển người dùng đến dịch vụ khách hàng nếu không tìm được câu trả lời

            5. Ví dụ mẫu:
                Câu hỏi: "Đoàn viên có những quyền gì?"
                
                Câu trả lời:
                Theo Điều lệ Đoàn, Điều 4 quy định về quyền của đoàn viên như sau:

                Điều 4: Quyền của đoàn viên
                1. Được thảo luận, đóng góp ý kiến về công tác Đoàn
                2. Được bầu cử, ứng cử vào cơ quan lãnh đạo các cấp của Đoàn
                3. Được báo cáo, phản ánh, chất vấn về hoạt động của tổ chức Đoàn
                4. Được bảo vệ quyền lợi chính đáng trước tổ chức Đoàn

                [Điều lệ Đoàn] - [Trang 5] - [**Link tham khảo**](link_to_document)

                Bạn có muốn tìm hiểu thêm về nghĩa vụ của đoàn viên không?
 
            Previous conversation history:
            """
        ),
        
        MessagesPlaceholder(variable_name="chat_history"),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),

    ]
)

agent_llm_with_tools = get_model_function().bind_tools(agent_tools)

rag_agent = (
    {
        "input": lambda x: x["input"],
        "agent_scratchpad": lambda x: format_to_openai_tool_messages(
            x["intermediate_steps"]
        ),
        "chat_history": lambda x: x["chat_history"],
        
    }
    | agent_prompt
    | agent_llm_with_tools
    | OpenAIToolsAgentOutputParser()
)

rag_agent_executor = AgentExecutor(
    agent=rag_agent,
    tools=agent_tools,
    verbose=True,
    return_intermediate_steps=True,
    handle_parsing_errors=True,
)

chat_agent = RunnableWithMessageHistory(
    rag_agent_executor,
    get_memory,
    input_messages_key="input",
    history_messages_key="chat_history",
)


def get_agent():
    """
    Lấy agent thực thi các chức năng tương tác của chatbot, bao gồm xử lý lịch sử hội thoại
    và các công cụ được cung cấp.

    Returns:
        RunnableWithMessageHistory: Agent hỗ trợ lịch sử hội thoại và công cụ.
    """
    return chat_agent
