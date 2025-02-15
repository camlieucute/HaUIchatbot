"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import { Send, Loader2, Home, HelpCircle, Info, Settings, MessageCircleQuestion } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function Chatbot() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("start")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    const newMessages: Message[] = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("https://qbadinh-chatbot.onrender.com/", {
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
        const assistantMessage: Message = { role: "assistant", content: data.output }
        setMessages([...newMessages, assistantMessage])
      } else {
        const errorMessage: Message = {
          role: "assistant",
          content: "Xin lỗi, tôi gặp lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại.",
        }
        setMessages([...newMessages, errorMessage])
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.",
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <SidebarProvider defaultOpen>
          <div className="flex min-h-[calc(100vh-2rem)] gap-4">
            <Sidebar className="w-64">
              <SidebarHeader>
                <SidebarMenuButton 
                  isActive={activeSection === "start"}
                  onClick={() => setActiveSection("start")}
                >
                  <Home className="mr-2" />
                  <span>Getting Started</span>
                </SidebarMenuButton>
                <SidebarMenuButton 
                  isActive={activeSection === "how-it-works"}
                  onClick={() => setActiveSection("how-it-works")}
                >
                  <HelpCircle className="mr-2" />
                  <span>How it Works?</span>
                </SidebarMenuButton>
                <SidebarMenuButton 
                  isActive={activeSection === "about"}
                  onClick={() => setActiveSection("about")}
                >
                  <Info className="mr-2" />
                  <span>About the chatbot</span>
                </SidebarMenuButton>
              </SidebarHeader>
              <SidebarSeparator />
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === "faq"}
                      onClick={() => setActiveSection("faq")}
                    >
                      <MessageCircleQuestion className="mr-2" />
                      <span>FAQ (Frequently Asked Questions)</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={activeSection === "settings"}
                      onClick={() => setActiveSection("settings")}
                    >
                      <Settings className="mr-2" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>

            <Card className="flex-1 flex flex-col bg-blue-50 shadow-lg">
              <CardHeader className="bg-blue-600 text-white py-4">
                <CardTitle className="text-2xl font-bold text-center">Chatbot Hòa Bình</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block max-w-[80%] p-3 rounded-lg ${
                          message.role === "user" ? "bg-blue-500 text-white" : "bg-white text-blue-800 shadow"
                        }`}
                      >
                        <ReactMarkdown className="markdown-content text-sm md:text-base">
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
                  <Button onClick={handleSendMessage} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}