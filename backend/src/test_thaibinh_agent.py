import pytest
import csv
import time
from agents.rag_agent import get_agent


@pytest.fixture
def input_examples() -> dict[str, list[str]]:
    """
    Example dictionary to test agent tool calling
    """

    examples = {
        "semantic_search_examples": [
            "1.	Đoàn Thanh niên Cộng sản Hồ Chí Minh được thành lập và lãnh đạo bởi ai?",
            "2.	Những mục tiêu và lý tưởng mà Đoàn Thanh niên Cộng sản Hồ Chí Minh phấn đấu vì là gì?",
            "3.	Điều kiện nào để một thanh niên Việt Nam được kết nạp vào Đoàn?",
            "4.	Các nhiệm vụ chính của một đoàn viên Đoàn Thanh niên Cộng sản Hồ Chí Minh là gì?",
            "5.	Cơ quan lãnh đạo cao nhất của Đoàn Thanh niên Cộng sản Hồ Chí Minh là gì?",
           " 6.	Đoàn Thanh niên Cộng sản Hồ Chí Minh hoạt động dựa trên nguyên tắc nào?",
            "7.	Nhiệm vụ chính của tổ chức cơ sở Đoàn là gì?",
            "8.	Hệ thống tổ chức của Đoàn Thanh niên Cộng sản Hồ Chí Minh bao gồm những cấp nào?",
            "9.	Các hình thức khen thưởng mà Đoàn có thể áp dụng là gì?",
            "10.	Cơ quan nào chịu trách nhiệm giám sát và kiểm tra việc chấp hành Điều lệ Đoàn?",
           " 1.	Tên đầy đủ và ý nghĩa của giải thưởng “Nhà giáo trẻ tiêu biểu” là gì?",
           " 2.	Điều kiện về độ tuổi để xét trao giải thưởng này là gì?",
            "3.	Một cá nhân có thể nhận giải thưởng “Nhà giáo trẻ tiêu biểu” bao nhiêu lần?",
           " 4.	Các tiêu chuẩn chung mà ứng viên cần đáp ứng để được xét giải thưởng là gì?",
        "    5.	Hội đồng xét chọn giải thưởng được thành lập bởi ai và bao gồm những thành phần nào?",
            "6.	Tiêu chuẩn cụ thể nào áp dụng cho giảng viên đại học khi xét chọn giải thưởng?",
          "  7.	Quyền lợi và trách nhiệm của cá nhân nhận giải thưởng là gì?",
           " 8.	Quy trình xét chọn giải thưởng bao gồm những bước nào?",
           " 9.	Những vi phạm nào có thể dẫn đến việc thu hồi giải thưởng “Nhà giáo trẻ tiêu biểu”?",
            "10.Ai có thẩm quyền điều chỉnh và sửa đổi Quy chế giải thưởng này?",

        ],
        "cant_anwser_question": ["What is the current wait time at Wallace-Hamilton?",
                                 "Thông tin về khoa CNTT tại trường Đại học công nghiệp",
                                 "Thủ tưởng chính phủ hiện tại của việt nam là ai?"],

    }

    return examples


def test_agent_tool_calling(input_examples: dict[str, list[str]]) -> None:
    """
    Test to ensure the hospital agent calls the correct tools and save runtime and answers to CSV
    """
    thaibinh_agent = get_agent()

    # Open the CSV file for writing
    with open("test_results.csv", mode="w", newline="", encoding="utf-8") as csvfile:
        csv_writer = csv.writer(csvfile)

        # Write the header
        csv_writer.writerow(["Category", "Input", "Answer", "Time Taken (seconds)"])

        # Test semantic_search_examples
        for example in input_examples["semantic_search_examples"]:
            start_time = time.time()
            response = thaibinh_agent.invoke(
                {"input": example},
                {"configurable": {"session_id": 1837743}}
            )
            end_time = time.time()
            time_taken = end_time - start_time
            answer = response.get("output", "No answer")  # Get the answer, fallback to "No answer" if missing
            csv_writer.writerow(["semantic_search_examples", example, answer, f"{time_taken:.2f}"])

        # Test cant_answer_question
        for example in input_examples["cant_anwser_question"]:
            start_time = time.time()
            response = thaibinh_agent.invoke(
                {"input": example},
                {"configurable": {"session_id": 1837743}}
            )
            end_time = time.time()
            time_taken = end_time - start_time
            answer = response.get("output", "No answer")  # Get the answer, fallback to "No answer" if missing
            csv_writer.writerow(["cant_anwser_question", example, answer, f"{time_taken:.2f}"])

    print("Results saved to test_results.csv")

    