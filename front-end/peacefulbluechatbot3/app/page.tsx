import Image from "next/image"
import { Chatbot } from "@/components/Chatbot"
import { AppSidebar } from "@/components/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm z-10">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="text-2xl font-semibold text-gray-900 ml-4">Chatbot - Nghiệp vụ Đoàn, Hội, Đội</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/vi/0/09/Huy_Hi%E1%BB%87u_%C4%90o%C3%A0n.png"
                  alt="Logo Đoàn TNCS Hồ Chí Minh"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Bi%E1%BB%83u_tr%C6%B0ng_H%E1%BB%99i_Li%C3%AAn_hi%E1%BB%87p_Thanh_ni%C3%AAn_Vi%E1%BB%87t_Nam.svg/400px-Bi%E1%BB%83u_tr%C6%B0ng_H%E1%BB%99i_Li%C3%AAn_hi%E1%BB%87p_Thanh_ni%C3%AAn_Vi%E1%BB%87t_Nam.svg.png"
                  alt="Logo Hội Liên hiệp Thanh niên Việt Nam"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <Image
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Doi-Thieu-nien-Tien-phong-Ho-Chi-Minh.png"
                  alt="Logo Đội Thiếu niên Tiền phong Hồ Chí Minh"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-6xl mx-auto flex flex-col h-full">
              <div className="flex-grow">
                <Chatbot />
              </div>
              <footer className="mt-8 text-center text-sm text-gray-500">
                © 2025 Developed by Ho Chi Minh Communist Youth Union, Ba Dinh District
              </footer>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

