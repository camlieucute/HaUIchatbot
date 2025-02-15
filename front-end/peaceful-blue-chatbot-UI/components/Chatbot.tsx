"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Send, Loader2 } from "lucide-react"
import Image from "next/image"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin", "vietnamese"] })

interface Message {
  role: "user" | "assistant"
  content: string
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatHistory');
      return savedMessages ? JSON.parse(savedMessages) : [];
    }
    return [];
  });
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    setMessages([...newMessages, { role: "assistant", content: "..." }])

    try {
      const response = await fetch("https://qbadinh.onrender.com/docs-rag-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input,
          session: "default_session",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages([...newMessages, { role: "assistant", content: data.output }])
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại." },
        ])
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error)
      setMessages([...newMessages, { role: "assistant", content: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại." }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <Card className="w-full max-w-6xl mx-auto h-[calc(100vh-40px)] flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+CjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPgo8cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTI1IDI1bTEyLjUgMGExMi41IDEyLjUgMCAxIDEtMjUgMCAxMi41IDEyLjUgMCAxIDEgMjUgMCIgc3Ryb2tlPSIjZmZmZmZmMjAiIHN0cm9rZS13aWR0aD0iMSIvPgo8cGF0aCBkPSJNMjUgMjVtLTI1IDBhMjUgMjUgMCAxIDAgNTAgMCAyNSAyNSAwIDEgMC01MCAwIiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9wYXR0ZXJuPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+Cjwvc3ZnPg==')] opacity-20 mix-blend-soft-light"></div>
        <div className="relative z-10 flex items-center justify-between">
          <CardTitle className={`text-xl font-bold text-white drop-shadow-sm ${inter.className}`}>
            Chatbot - Nghiệp vụ Đoàn, Hội, Đội
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Button
              onClick={clearHistory}
              variant="ghost"
              className="text-white hover:bg-blue-700 transition-colors"
              title="Xóa lịch sử"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </Button>
            <div className="flex items-center space-x-2">
              <Image
                src="https://upload.wikimedia.org/wikipedia/vi/0/09/Huy_Hi%E1%BB%87u_%C4%90o%C3%A0n.png"
                alt="Logo Đoàn TNCS Hồ Chí Minh"
                width={28}
                height={28}
                className="rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110"
              />
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bi%E1%BB%83u_tr%C6%B0ng_H%E1%BB%99i_Li%C3%AAn_hi%E1%BB%87p_Thanh_ni%C3%AAn_Vi%E1%BB%87t_Nam.svg/400px-Bi%E1%BB%83u_tr%C6%B0ng_H%E1%BB%99i_Li%C3%AAn_hi%E1%BB%87p_Thanh_ni%C3%AAn_Vi%E1%BB%87t_Nam.svg.png"
                alt="Logo Hội Liên hiệp Thanh niên Việt Nam"
                width={28}
                height={28}
                className="rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110"
              />
              <Image
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Doi-Thieu-nien-Tien-phong-Ho-Chi-Minh.png"
                alt="Logo Đội Thiếu niên Tiền phong Hồ Chí Minh"
                width={28}
                height={28}
                className="rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-6 flex flex-col justify-between">
        <ScrollArea className="flex-1 pr-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block max-w-[80%] p-4 rounded-2xl shadow-md ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium"
                    : "bg-white border border-gray-100 text-gray-800 shadow-lg"
                }`}
              >
                {message.content === "..." ? (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                ) : (
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-3" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2" {...props} />,
                      p: ({ node, ...props }) => (
                        <p className={`mb-2 ${message.role === "user" ? "text-white/90" : "text-gray-700"}`} {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className={`list-disc list-inside mb-2 ${message.role === "user" ? "text-white/90" : "text-gray-700"}`} {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className={`list-decimal list-inside mb-2 ${message.role === "user" ? "text-white/90" : "text-gray-700"}`} {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className={`mb-1 ${message.role === "user" ? "text-white/90" : "text-gray-700"}`} {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className={`${
                            message.role === "user" 
                              ? "text-white underline hover:text-blue-100" 
                              : "text-blue-600 hover:underline"
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote 
                          className={`border-l-4 ${
                            message.role === "user"
                              ? "border-white/30 text-white/90"
                              : "border-gray-300 text-gray-700"
                          } pl-4 italic my-2`}
                          {...props}
                        />
                      ),
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "")
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-md my-2 text-sm"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code 
                            className={`${
                              message.role === "user"
                                ? "bg-blue-700/50 text-white"
                                : "bg-gray-100 text-gray-800"
                            } rounded px-1.5 py-0.5 text-sm`} 
                            {...props}
                          >
                            {children}
                          </code>
                        )
                      },
                    }}
                    className="markdown-content text-base leading-relaxed"
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="mt-6 flex items-center space-x-3 bg-white p-3 rounded-2xl shadow-md">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            className="flex-1 border-none focus:ring-0 focus:ring-offset-0 text-lg rounded-xl font-nunito bg-blue-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)] transition-all duration-200"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-blue-300 hover:bg-blue-400 text-blue-800 rounded-xl px-6 py-3 font-nunito shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_-4px_6px_rgba(0,0,0,0.1)] transition-all duration-200"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          © 2025 Phát triển bởi Đoàn TNCS Hồ Chí Minh quận Ba Đình
        </div>
      </CardContent>
    </Card>
  )
}

