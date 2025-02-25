import Image from "next/image"
import Link from "next/link"
import { Chatbot } from "@/components/Chatbot"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
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
                    Chatbot - Nghiệp vụ Đoàn, Hội, Đội
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Hỗ trợ tư vấn 24/7 về công tác Đoàn và phong trào thanh thiếu nhi</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <button
                  className="group relative"
                  aria-label="Logo Đoàn TNCS Hồ Chí Minh"
                  role="button"
                  tabIndex={0}
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/vi/0/09/Huy_Hi%E1%BB%87u_%C4%90o%C3%A0n.png"
                    alt="Logo Đoàn TNCS Hồ Chí Minh"
                    width={44}
                    height={44}
                    className="rounded-full transition-all duration-300 ease-in-out transform group-hover:scale-110 group-focus:scale-110 shadow-md group-hover:shadow-lg"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 whitespace-nowrap">
                    Đoàn TNCS HCM
                  </span>
                </button>
                <button
                  className="group relative"
                  aria-label="Logo Hội Liên hiệp Thanh niên Việt Nam"
                  role="button"
                  tabIndex={0}
                >
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bi%E1%BB%83u_tr%C6%B0ng_H%E1%BB%99i_Li%C3%AAn_hi%E1%BB%87p_Thanh_ni%C3%AAn_Vi%E1%BB%87t_Nam.svg/400px-Bi%E1%BB%83u_tr%C6%B0ng_H%E1%BB%99i_Li%C3%AAn_hi%E1%BB%87p_Thanh_ni%C3%AAn_Vi%E1%BB%87t_Nam.svg.png"
                    alt="Logo Hội Liên hiệp Thanh niên Việt Nam"
                    width={44}
                    height={44}
                    className="rounded-full transition-all duration-300 ease-in-out transform group-hover:scale-110 group-focus:scale-110 shadow-md group-hover:shadow-lg"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 whitespace-nowrap">
                    Hội LHTN VN
                  </span>
                </button>
                <button
                  className="group relative"
                  aria-label="Logo Đội Thiếu niên Tiền phong Hồ Chí Minh"
                  role="button"
                  tabIndex={0}
                >
                  <Image
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Doi-Thieu-nien-Tien-phong-Ho-Chi-Minh.png"
                    alt="Logo Đội Thiếu niên Tiền phong Hồ Chí Minh"
                    width={44}
                    height={44}
                    className="rounded-full transition-all duration-300 ease-in-out transform group-hover:scale-110 group-focus:scale-110 shadow-md group-hover:shadow-lg"
                  />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all duration-200 whitespace-nowrap">
                    Đội TNTP HCM
                  </span>
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            <div className="h-[calc(100vh-8rem)] max-w-6xl mx-auto flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
              <div className="flex-grow p-4">
                <Chatbot />
              </div>
              <footer className="px-4 py-2 border-t border-gray-200 bg-gray-50/50 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Link href="/getting-started" className="text-gray-600 hover:text-blue-600 transition-colors">Hướng dẫn</Link>
                    <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Chính sách</Link>
                    <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Điều khoản</Link>
                  </div>
                  <div className="text-right text-gray-600">
                    <p> 2025 Ho Chi Minh Communist Youth Union, Ba Dinh</p>
                    <p>Hỗ trợ: thien2632003@gmail.com</p>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
