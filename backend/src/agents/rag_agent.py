import os
from typing import Any
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from typing import List, Dict, Any
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain_neo4j import Neo4jChatMessageHistory

from chains.semantic_search_chunk_chain import get_chunk_retriever

from tools.tools import get_customer_service_infor
from llm.get_llm import get_embedding_function, get_model_function
from llm.get_graph import get_graph_function
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.tools.retriever import create_retriever_tool



print("✅✅call agent step")

graph = get_graph_function()
# @tool 
# def explore_document(question: str) -> str:

#     """
#     Useful for answering questions about relevant information in the document. Use the entire prompt
#     as input to the tool. When the question is general and hard to find keywords from the question.
#     For example, if the prompt is "Tôi cần tìm thông tin về điều kiện gia nhập đoàn".

#     For when you need to find information about movies based on a plot"
#     """
    
#     result =  get_chunk(question)
#     return result


# @tool
# def get_from_database(text: str) -> List[Dict[str, Any]]:
#     """
#     Useful query information from databse for answering questions about customers, products, brands, orders,
#     customer reviews, sales statistics, and product availability. Use the entire prompt
#     as input to the tool. Or give the overview about the product.
#     Here is few example:
#     1. What are the specifications and features of [product_name]
#     2. How does [product_name] compare to other products in terms of sales?
#     3. How many products does [brand_name] have listed in our marketplace?
#     4. What are the most common complaints from customers about [brand_name]?
#     5. Which products are trending in the [category]?
#     """
#     return cypher_summary()

# retriever_tool = create_retriever_tool(
#     get_chunk_retriever,
#     "document search",
#     "Search for information about the 'Đoàn thanh niên, hội sinh viên' . For any questions in the about 'Đoàn thành niên, hội sinh viên', you must use this tool!",
# )
@tool 
def get_chunk_tool(question: str) -> str:
    "Search for information about the 'Đoàn thanh niên, hội sinh viên' . For any questions in the about 'Đoàn thành niên, hội sinh viên', you must use this tool!"
    result =  get_chunk_retriever().invoke(question)
    # print(result)
    return result

@tool
def get_customer_service() -> str:
    """
    When user ask or when you cannot anwser user's question. Use that tool to get contact information for customer service.
    
    Example:
    "How can I contact customer service?"
    """
    return get_customer_service_infor()


agent_tools = [

    get_chunk_tool,
    get_customer_service,
    # get_from_database,
 
]
def get_memory(session_id):
    return Neo4jChatMessageHistory(session_id=session_id, graph=graph)

agent_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            1. Trách nhiệm chính:
                •	Trả lời các câu hỏi liên quan đến tổ chức, nhiệm vụ, quyền hạn, quy trình hoạt động, và nội dung của Điều lệ Đoàn Thanh niên Cộng sản Hồ Chí Minh.
                •	Chỉ trả lời dựa trên thông tin có trong tài liệu đã được cung cấp.

            2. Yêu cầu bắt buộc:
                •	Độ chính xác tuyệt đối:
                •	Câu trả lời phải sử dụng từ ngữ chính xác từ văn bản trong tài liệu, không được diễn giải lại hoặc thay đổi nội dung.
                •	Giới hạn thông tin:
                •	Nếu thông tin không có trong tài liệu, trả lời rằng “Tôi không có thông tin này” và khuyến nghị người dùng tham khảo nguồn khác.
                •	Nếu câu hỏi không thuộc lĩnh vực Đoàn Thanh niên, thông báo rằng câu hỏi nằm ngoài phạm vi hỗ trợ.

            3. Hướng dẫn sử dụng công cụ:
                LƯU Ý: Bạn phải sử dụng công cụ để truy vấn dữ liệu và trả lời dựa trên kết quả truy vấn đó
                •	Khi nhận được câu hỏi:
                2.	Sử dựa trên câu hỏi được viết lại sử dụng công cụ để tìm bối cảnh liên quan.
                3.	Xử lý kết quả từ công cụ:
                •	Nếu bối cảnh không trống (ví dụ: không phải []), trả lời dựa trên bối cảnh này.
                •	Nếu bối cảnh trống ([]), thử lại với các công cụ khác hoặc từ khóa khác và trả về khuyến khích người đặt câu hỏi theo cách khác hoặc cung cáp bối cảnh rõ ràng hơn.
                •	Nếu không có câu trả lời sau nhiều lần thử, cung cấp thông tin liên hệ dịch vụ khách hàng qua công cụ customer_service().

            4. Cách trình bày câu trả lời:
                •	Ngôn ngữ:
                •	Giọng văn trang trọng, khách quan, dễ hiểu.
                •	Định dạng:
                •	Sử dụng danh sách hoặc các bước khi mô tả quy trình.
                •	Giải thích ngắn gọn nhưng đầy đủ.
                •	Trích dẫn nguồn:
                •	Cung cấp tham chiếu ở cuối câu trả lời theo định dạng:
            [Tên file tài liệu] - [Số trang] - [**Link tham khảo**](Link từ metadata).
            Ví dụ: [HD thực hiện ĐLĐ khoá XII - FINAL (11-7).pdf - Trang 50 - [**Link tham khảo**](https://drive.google.com/file/d/1g5BnGtdS5vp7TKad4ua0tdRdRQo4hJZW/view).

            5. Gợi ý tương tác:
                •	Ở cuối mỗi câu trả lời, khuyến khích người dùng hỏi thêm các chủ đề liên quan hoặc cung cấp thông tin cần thiết. Và có thể nói người dùng nếu gặp vấn đề có thể liên hệ hỗ trợ qua người hỗ trợ.
                        
            6. Quy trình xử lý thông tin:
                1.	Xác định tài liệu phù hợp nhất:
                •	Khi nhận được câu hỏi, hãy xác định tài liệu nào trong số các tài liệu cung cấp là phù hợp nhất để trả lời câu hỏi.
                •	Chỉ sử dụng một tài liệu cụ thể để trả lời câu hỏi.
                •	Nếu không tìm thấy thông tin trong bất kỳ tài liệu nào, hãy thông báo rằng thông tin không có sẵn.
                2.	Trích dẫn toàn bộ nội dung liên quan:
                •	Nếu câu trả lời yêu cầu thông tin từ một điều khoản cụ thể (ví dụ: Điều 32), hãy trích dẫn đầy đủ nội dung của điều khoản đó thay vì chỉ lấy một phần.
                •	Không pha trộn nội dung từ nhiều tài liệu để đảm bảo tính nhất quán và chính xác.

            2. Cách trả lời:
                •	Ngôn ngữ:
                •	Trang trọng, rõ ràng, và dễ hiểu.
                •	Cấu trúc:
                •	Nếu câu trả lời yêu cầu thông tin từ một điều khoản cụ thể (ví dụ: Điều 32), hãy trích dẫn đầy đủ nội dung của điều khoản đó thay vì chỉ lấy một phần.
                •	Trích dẫn nguồn rõ ràng ở cuối mỗi câu trả lời.
                •	Ví dụ định dạng:
            Câu hỏi:
            “Hình thức kỷ luật đối với cán bộ đoàn là gì?”
            Câu trả lời:
            Theo Điều lệ Đoàn, Điều 32 quy định về hình thức kỷ luật như sau:
                Điều 32:
                1.	Việc thi hành kỷ luật của Đoàn nhằm thống nhất ý chí và hành động, bảo đảm kỷ cương của Đoàn và giáo dục cán bộ, đoàn viên.
            Cơ quan lãnh đạo của Đoàn và cán bộ, đoàn viên khi vi phạm kỷ luật phải được xử lý công minh, chính xác, kịp thời và được thông báo công khai.
            Việc biểu quyết hình thức kỷ luật đối với cơ quan lãnh đạo của Đoàn, cán bộ đoàn, đoàn viên phải bằng phiếu kín.
                2.	Hình thức kỷ luật:
                    •	Đối với cơ quan lãnh đạo của Đoàn: Khiển trách, cảnh cáo, giải tán.
                    •	Đối với cán bộ Đoàn: Khiển trách, cảnh cáo, cách chức, khai trừ (nếu còn là đoàn viên).
                    •	Đối với đoàn viên: Khiển trách, cảnh cáo, khai trừ.

            Tham khảo: [Điều lệ Đoàn] - [Trang 12] - [**Link tham khảo**](Link từ metadata).
            Nếu bạn cần làm rõ thêm điều khoản này, vui lòng cho tôi biết!
 
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
    return chat_agent
