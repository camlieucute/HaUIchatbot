"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // dùng 'next/navigation' thay vì 'next/router' trong app router

import { Chatbot } from "@/components/Chatbot";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const agreed = localStorage.getItem("policyAgreed");
    if (!agreed) {
      router.push("/privacy"); // Chuyển hướng nếu chưa đồng ý
    }
  }, [router]);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/70">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm z-50 transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto py-4 px-6 lg:px-8 flex justify-between items-center space-x-8">
              <div className="flex items-center space-x-6">
                <SidebarTrigger className="hover:bg-gray-100 rounded-lg p-2.5 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-purple-400 focus:outline-none" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                    Chatbot - Trường Đại học Công nghiệp Hà Nội
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Hỗ trợ tra cứu 24/7 về thông tin Trường Đại học Công nghiệp
                    Hà Nội
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                {/* 3 logo */}
                {[
                  ["logotruong.jpg", "HaUI"],
                  ["Huy_Hiệu_Đoàn.png", "Đoàn Thanh niên Việt Nam"],
                  ["hoi.svg", "Hội sinh viên Việt Nam"],
                ].map(([src, label], idx) => (
                  <button
                    key={idx}
                    className="group relative"
                    aria-label={`Logo ${label}`}
                    role="button"
                    tabIndex={0}
                  >
                    <Image
                      src={src}
                      alt={`Logo ${label}`}
                      width={44}
                      height={44}
                      className="rounded-full transition-all duration-300 ease-in-out transform group-hover:scale-110 group-focus:scale-110 shadow-md group-hover:shadow-lg"
                    />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 whitespace-nowrap">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4">
            <div className="h-[calc(100vh-8rem)] max-w-6xl mx-auto flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
              <div className="flex-grow p-4">
                <Chatbot chatType="docs-rag" />
              </div>
              <footer className="px-4 py-2 border-t border-gray-200 bg-gray-50/50 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Link
                      href="/getting-started"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Hướng dẫn
                    </Link>
                    <Link
                      href="/privacy"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Chính sách và Điều khoản
                    </Link>
                  </div>
                  <div className="text-right text-gray-600">
                    <p>2025 Đồ án tốt nghiệp CamThiLieu</p>
                    <p>Hỗ trợ: camlieu0086@gmail.com</p>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
