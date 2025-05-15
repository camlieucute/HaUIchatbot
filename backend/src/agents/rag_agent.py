import logging
from langchain.agents import AgentExecutor, tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain_core.output_parsers import StrOutputParser
from langchain_neo4j import Neo4jChatMessageHistory

from chains.semantic_search_chunk_chain import get_chunk_retriever

from tools.tools import get_customer_service_infor
from llm.get_llm import get_embedding_function, get_model_function
from llm.get_graph import get_graph_function
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.documents import Document
from typing import List


logger = logging.getLogger(__name__)
print("✅✅call agent step")

graph = get_graph_function()


@tool
def get_chunk_tool(question: str) -> str:
    """
    Tìm kiếm thông tin về 'Đoàn thanh niên, hội sinh viên'. 
    Đối với bất kỳ câu hỏi nào liên quan đến 'Đoàn thanh niên, hội sinh viên', hãy sử dụng công cụ này.
    """
    retrieved_docs: List[Document] = get_chunk_retriever().invoke(question)
    # Log the retrieved documents
    print("\n--- Retrieved Documents ---")
    if retrieved_docs:
        for i, doc in enumerate(retrieved_docs):
            print(f"\n--- Document {i+1} ---")
            print(f"Content: {doc.page_content}")
            print(f"Metadata: {doc.metadata}")
    else:
        print("No documents found.")
    print("--- End Retrieved Documents ---\n")
    # Format the retrieved documents into a single string
    formatted_context = "\n\n".join([doc.page_content for doc in retrieved_docs])
    return formatted_context


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
                   • Trả lời các câu hỏi liên quan đến thông tin từ **tài liệu chính thức** được cung cấp
                
                2. Quy tắc trả lời:
                   • Trích dẫn nguyên văn, chính xác từ tài liệu gốc
                   • Nếu không tìm thấy thông tin, trả lời: "Tôi không có thông tin này trong tài liệu"
                   • Trích dẫn đầy đủ nội dung điều khoản hoặc đoạn văn liên quan
                   • Chỉ sử dụng **một tài liệu duy nhất** cho mỗi câu trả lời; nếu nhiều tài liệu, ưu tiên tài liệu mới nhất
                
                3. Định dạng:
                   • Văn phong trang trọng, rõ ràng
                   • Trích dẫn nguồn theo format: [Tên tài liệu] - [Trang] - [**Link tham khảo**](Link)
                   • Kết thúc bằng 1 câu gợi ý câu hỏi liên quan
                
                4. Quy trình:
                   • Tìm kiếm nội dung trong tài liệu được cung cấp
                   • Nếu không tìm thấy, tìm lại bằng từ khóa gần nghĩa
                   • Nếu vẫn không tìm thấy, trả lời theo quy tắc trên và **hướng dẫn người dùng liên hệ bộ phận hỗ trợ hoặc giáo viên phụ trách**
                
                5. Ví dụ mẫu:
                   Câu hỏi: "Quy định về đồng phục của học sinh là gì?"
                
                   Câu trả lời:
                   Theo Quy định Nội quy học sinh 2023, Điều 5 quy định về đồng phục học sinh như sau:
                
                   Điều 5: Quy định đồng phục
                   1. Học sinh mặc đồng phục vào thứ Hai, thứ Năm hàng tuần và các ngày lễ
                   2. Áo sơ mi trắng, quần xanh đen; học sinh nữ có thể mặc váy xanh đen theo mẫu quy định
                   3. Không sử dụng trang phục không phù hợp môi trường học đường
                
                   [Nội quy học sinh 2023] - [Trang 3] - [**Link tham khảo**](link_to_document)
                
                   Bạn có muốn tìm hiểu thêm về quy định sử dụng điện thoại trong lớp không?
                
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


def ask_in_content(question: str, context: str) -> str:
    """
    Trả lời câu hỏi dựa trên nội dung được cung cấp.

    Args:
        question: Câu hỏi cần trả lời.
        context: Nội dung để tìm kiếm câu trả lời.

    Returns:
        Câu trả lời từ mô hình ngôn ngữ.
    """
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Bạn là một trợ lý AI hữu ích. Chỉ sử dụng thông tin được cung cấp trong CONTEXT để trả lời câu hỏi. "
                "Nếu thông tin không có trong CONTEXT, hãy trả lời là bạn không tìm thấy thông tin.",
            ),
            ("user", "CONTEXT:\n{context}\n\nQUESTION:\n{question}"),
        ]
    )
    llm = get_model_function()
    chain = prompt | llm | StrOutputParser()
    
    answer = chain.invoke({"question": question, "context": context})
    return answer
