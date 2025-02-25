"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/getting-started", label: "Hướng dẫn" },
  { href: "/how-it-works", label: "Cách hoạt động" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-center space-x-8">
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
              <span className="text-xl text-white animate-pulse">🤖</span>
            </div>
            <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              Chatbot
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative transition-colors hover:text-foreground/80 px-2 py-1 rounded-md
                  ${pathname === item.href
                    ? "text-blue-600 font-bold bg-blue-50"
                    : "text-foreground/60 hover:bg-gray-50"
                  }
                  before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 
                  before:bg-gradient-to-r before:from-purple-600 before:to-blue-500
                  before:transform before:scale-x-0 before:transition-transform before:duration-300
                  hover:before:scale-x-100
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90 px-6 py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Bắt đầu hỏi đáp
            </Button>
          </Link>
        </div>
      </div>
      {/* Decorative bottom border gradient */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
    </header>
  )
}
