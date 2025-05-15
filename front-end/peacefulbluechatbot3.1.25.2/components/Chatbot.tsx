"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown, { Components } from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Send, Loader2, User, Bot } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatbotProps {
  initialContext?: string;
  chatType: 'docs-rag' | 'ask-in-content';
}

// Define types for code component props
interface CodeProps {
  node?: any; // Keeping 'any' for node as it's complex from remark
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MarkdownComponents: Components = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-sm mb-2">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} className="text-blue-500 hover:text-blue-700 underline">
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-inside mb-2">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-inside mb-2">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl font-bold mb-3">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-bold mb-2">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-bold mb-2">{children}</h3>
  ),
  code({ node, inline, className, children, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || "")
    return !inline && match ? (
      <SyntaxHighlighter 
        style={atomDark} 
        language={match[1]} 
        PreTag="div" 
        {...props}
        customStyle={{
          margin: '1em 0',
          borderRadius: '0.5rem',
          padding: '1em'
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code 
        {...props}
        className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono"
      >
        {children}
      </code>
    )
  },
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-200 pl-4 italic my-2">
      {children}
    </blockquote>
  ),
}

export function Chatbot({ initialContext, chatType }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Add initial context message based on chatType
  useEffect(() => {
    if (chatType === 'ask-in-content' && initialContext) {
      setMessages([
        {
          role: "assistant",
          content: "Tôi đã sẵn sàng để trả lời các câu hỏi về bài viết này. Bạn có thể hỏi bất kỳ điều gì!",
          timestamp: new Date()
        }
      ]);
    } else if (chatType === 'docs-rag') {
      setMessages([
        {
          role: "assistant",
          content: "Xin chào! Tôi có thể giúp gì cho bạn?",
          timestamp: new Date()
        }
      ]);
    }
  }, [initialContext, chatType]);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        const scrollToPosition = scrollContainer.scrollHeight
        scrollContainer.scrollTo({
          top: scrollToPosition,
          behavior: 'smooth'
        })
      }
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      // Add a small delay to ensure the DOM has updated and animations are complete
      const scrollTimeout = setTimeout(scrollToBottom, 150)
      return () => clearTimeout(scrollTimeout)
    }
  }, [messages, scrollToBottom])
  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessageContent = input;
    const newUserMessage: Message = { role: "user", content: userMessageContent, timestamp: new Date() };
    const currentMessages = [...messages, newUserMessage];
    setMessages(currentMessages);
    setInput("");
    setIsLoading(true);
    // scrollToBottom() // Call after assistant placeholder is added

    // Add assistant placeholder immediately
    const assistantPlaceholderMessage: Message = { role: "assistant", content: "...", timestamp: new Date() };
    setMessages([...currentMessages, assistantPlaceholderMessage]);
    scrollToBottom(); // Scroll after user and placeholder message are added

    let apiUrl = "";
    let requestBody = {};

    if (chatType === 'docs-rag') {
      apiUrl = "http://localhost:8000/docs-rag-agent";
      requestBody = {
        text: userMessageContent,
        session: "default_session",
      };
    } else if (chatType === 'ask-in-content') {
      apiUrl = "http://localhost:8000/ask-in-content";
      requestBody = {
        question: userMessageContent,
        context: initialContext,
      };
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const assistantResponseContent = chatType === 'docs-rag' ? data.output : data.answer;
      const finalAssistantMessage: Message = { role: "assistant", content: assistantResponseContent, timestamp: new Date() };
      setMessages([...currentMessages, finalAssistantMessage]);
      // scrollToBottom() // Already called after placeholder
    } catch (error) {
      console.error("Error details:", error)
      let errorMessageContent = "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại."
      if (error instanceof Error) {
        errorMessageContent += ` Chi tiết lỗi: ${error.message}`
      }
      // Replace the placeholder with the error message
      const errorAssistantMessage: Message = { role: "assistant", content: errorMessageContent, timestamp: new Date() };
      setMessages([...currentMessages, errorAssistantMessage]);
    } finally {
      setIsLoading(false)
      // scrollToBottom is called when messages state updates through useEffect
    }
  }

  return (
    <Card className="w-full h-full flex flex-col bg-gradient-to-b from-white to-gray-50 shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <CardContent className="flex-1 overflow-hidden p-4 flex flex-col h-full">
        <ScrollArea className="flex-1 pr-2 mb-4" ref={scrollAreaRef}>
          <div className="space-y-6 py-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    {message.role === "user" ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div
                        className={`p-3 rounded-2xl shadow-sm ${
                          message.role === "user" 
                            ? "bg-blue-500 text-white rounded-tr-none" 
                            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                        }`}
                      >
                        {message.content === "..." ? (
                          <div className="flex items-center space-x-2 px-2 py-1">
                            <div className="typing-animation">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                          </div>
                        ) : (
                          <ReactMarkdown
                            components={MarkdownComponents}
                          >
                            {message.content}
                          </ReactMarkdown>
                        )}
                      </div>
                      <span className={`text-xs text-gray-500 mt-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
                        {format(message.timestamp, 'HH:mm', { locale: vi })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
        <div className="mt-2 flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            className="flex-1 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading}
            className={`transition-all ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
