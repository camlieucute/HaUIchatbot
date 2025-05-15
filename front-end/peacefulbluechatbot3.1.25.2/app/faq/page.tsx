"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface FAQ {
  question: string;
  answer: string;
}

const FAQItem = ({
  question,
  answer,
  isOpen,
  toggleOpen,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}) => (
  <Card className="border border-gray-200 shadow-md">
    <CardHeader
      onClick={toggleOpen}
      className="cursor-pointer hover:bg-blue-50 transition-colors duration-200 px-6 py-4"
    >
      <CardTitle className="text-lg font-semibold text-blue-800">
        {question}
      </CardTitle>
    </CardHeader>
    {isOpen && (
      <CardContent className="px-6 pb-6 text-gray-700 text-base leading-relaxed">
        {answer}
      </CardContent>
    )}
  </Card>
);

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const router = useRouter();

  const faqs: FAQ[] = [
    {
      question: "1. Chính sách bảo mật là gì?",
      answer:
        "Chính sách bảo mật của chúng tôi giải thích cách thu thập, sử dụng và bảo vệ thông tin cá nhân của người dùng.",
    },
    {
      question: "2. Làm thế nào để liên hệ với bộ phận hỗ trợ?",
      answer:
        "Bạn có thể gửi email đến địa chỉ hỗ trợ camlieu0086@gmail.com hoặc gọi số hotline 0356090056.",
    },
    {
      question: "3. Chatbot có hỗ trợ 24/7 không?",
      answer:
        "Đúng vậy, chatbot của chúng tôi hỗ trợ người dùng mọi lúc, mọi nơi.",
    },
    {
      question: "4. Chatbot này có thể trả lời những câu hỏi nào?",
      answer:
        "Chatbot có thể trả lời các câu hỏi liên quan đến thông tin trường học, hoạt động tình nguyện, sự kiện và nhiều chủ đề khác.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="flex justify-center mb-6">
        <Header />
      </div>
      <div className="container mx-auto max-w-6xl">
        <Card className="shadow-xl border border-gray-200 px-6 py-8">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-blue-700">
              Câu Hỏi Thường Gặp
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-gray-700">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                toggleOpen={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}

            <div className="mt-10 text-center">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded-full transition-all duration-200"
                onClick={() => router.push("/")}
              >
                ⬅️ Trở về trang chính
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
