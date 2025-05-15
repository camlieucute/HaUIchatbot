"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, []); // Updated useEffect dependency

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    console.log("Bắt đầu gửi tin nhắn, input:", input);

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentInput = input; // Store input before clearing
    setInput("");
    setIsLoading(true);
    // Removed scrollToBottom() here, will scroll after response

    // Removed placeholder message addition

    try {
      const apiUrl = "http://localhost:8000/docs-rag-agent";
      console.log("Gọi API đến:", apiUrl, "với dữ liệu:", {
        text: currentInput,
        session: "default_session",
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: currentInput, // Use stored input
          session: "default_session",
        }),
      });

      let assistantMessage: Message;
      if (response.ok) {
        const data = await response.json();
        assistantMessage = { role: "assistant", content: data.output };
      } else {
        console.error("API Error:", response.status, await response.text()); // Log error details
        assistantMessage = {
          role: "assistant",
          content: `Xin lỗi, tôi gặp lỗi (${response.status}) khi xử lý yêu cầu của bạn. Vui lòng thử lại.`,
        };
      }
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Xin lỗi, đã xảy ra lỗi kết nối. Vui lòng thử lại.",
      };
      if (error instanceof Error) {
        errorMessage.content += ` Chi tiết: ${error.message}`;
      }
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      // Scroll to bottom after messages state is updated and component re-renders
      // Use a slight delay to ensure DOM update before scrolling
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  };

  // Update useEffect to scroll when messages change
  useEffect(() => {
    // Use a slight delay to ensure DOM update before scrolling
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [messages]);

  return (
    <Card className="w-full max-w-4xl mx-auto h-[calc(100vh-40px)] flex flex-col bg-blue-50 shadow-lg">
      <CardHeader className="bg-blue-600 text-white py-4">
        <CardTitle className="text-2xl font-bold text-center">
          Chatbot Trường Đại học Công nghiệp Hà Nội
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-800 shadow"
                }`}
              >
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                  className="markdown-content text-sm md:text-base"
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="mt-4 flex items-center space-x-2 bg-white p-2 rounded-lg shadow">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            className="flex-1 border-none focus:ring-0 focus:ring-offset-0"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
