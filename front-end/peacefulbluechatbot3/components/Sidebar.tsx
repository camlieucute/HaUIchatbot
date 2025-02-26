"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Book, HelpCircle, Info, Settings, MessageCircle, Home } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Getting Started", icon: Book, href: "/getting-started" },
    { title: "How it Works?", icon: HelpCircle, href: "/how-it-works" },
    { title: "About", icon: Info, href: "/about" },
    { title: "FAQ", icon: MessageCircle, href: "/faq" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Chatbot Menu</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center py-2 px-4 text-sm font-medium rounded-md",
                  pathname === item.href ? "bg-blue-100 text-blue-700" : "text-slate-700 hover:bg-slate-100",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 p-4">
        <p className="text-sm text-slate-500">© 2025 Đoàn TNCS Hồ Chí Minh quận Ba Đình</p>
      </SidebarFooter>
    </Sidebar>
  )
}

