"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/header";

export default function HowItWorksPage() {
  const router = useRouter();
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Chatbot Hoạt Động Như Thế Nào?
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá cách chatbot của chúng tôi sử dụng công nghệ tiên tiến để
            hỗ trợ bạn trong các hoạt động của Trường Đại học Công nghiệp Hà Nội
          </p>
        </div>

        {/* Overview Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">1. Giới thiệu tổng quan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Mục đích</h3>
                <p className="text-gray-600 mb-6">
                  Chatbot được phát triển nhằm giải quyết nhu cầu tư vấn và hỗ
                  trợ thông tin về hoạt động Đoàn - Hội - Đội một cách nhanh
                  chóng và hiệu quả.
                </p>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Lợi ích nổi bật</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">⚡</span>
                      <span>Phản hồi tức thì, không cần chờ đợi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">🎯</span>
                      <span>Độ chính xác cao nhờ AI tiên tiến</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">🔄</span>
                      <span>Cập nhật thông tin liên tục</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">🌟</span>
                      <span>Hỗ trợ 24/7 không giới hạn</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative h-[300px] bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg overflow-hidden">
                {/* Placeholder for illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    <p className="text-gray-600">Illustration placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process Steps Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            2. Quy trình hoạt động theo bước
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              {
                step: "Bước 1",
                title: "Nhập câu hỏi",
                desc: "Người dùng nhập câu hỏi bằng ngôn ngữ tự nhiên",
                icon: "💭",
                color: "from-pink-50 to-red-50",
              },
              {
                step: "Bước 2",
                title: "Xử lý NLP",
                desc: "Hệ thống phân tích và hiểu ý định câu hỏi",
                icon: "🧠",
                color: "from-purple-50 to-pink-50",
              },
              {
                step: "Bước 3",
                title: "Tra cứu dữ liệu",
                desc: "Tìm kiếm thông tin từ cơ sở dữ liệu",
                icon: "🔍",
                color: "from-blue-50 to-purple-50",
              },
              {
                step: "Bước 4",
                title: "Tạo phản hồi",
                desc: "Xây dựng câu trả lời phù hợp",
                icon: "⚙️",
                color: "from-cyan-50 to-blue-50",
              },
              {
                step: "Bước 5",
                title: "Phản hồi",
                desc: "Gửi câu trả lời đến người dùng",
                icon: "✨",
                color: "from-green-50 to-cyan-50",
              },
            ].map((step, i) => (
              <Card key={i} className={`bg-gradient-to-r ${step.color}`}>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{step.icon}</div>
                    <h3 className="font-semibold text-gray-800">{step.step}</h3>
                    <h4 className="font-medium mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Visual Demonstration */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">3. Minh họa trực quan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Ví dụ cuộc hội thoại</h3>
                <div className="space-y-4">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm font-medium">Người dùng:</p>
                    <p>
                      "Làm thế nào để đăng ký tham gia hoạt động tình nguyện?"
                    </p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-sm font-medium">Chatbot:</p>
                    <p>"Để đăng ký tham gia hoạt động tình nguyện, bạn cần:</p>
                    <ol className="list-decimal list-inside mt-2">
                      <li>Truy cập website đoàn trường</li>
                      <li>Điền form đăng ký online</li>
                      <li>Chờ xác nhận từ ban tổ chức</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="relative h-[300px] bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg">
                {/* Placeholder for flowchart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Flowchart placeholder</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">4. Các tính năng nổi bật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">🧠 Công nghệ NLP</h3>
                <p className="text-gray-600">
                  Sử dụng công nghệ xử lý ngôn ngữ tự nhiên tiên tiến để hiểu
                  chính xác ý định người dùng
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">🔄 Cập nhật liên tục</h3>
                <p className="text-gray-600">
                  Dữ liệu được cập nhật thường xuyên để đảm bảo thông tin luôn
                  mới nhất
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">📱 Đa nền tảng</h3>
                <p className="text-gray-600">
                  Tích hợp trên nhiều nền tảng: website, ứng dụng di động và
                  mạng xã hội
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">
              5. Bảo mật và quyền riêng tư
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Cam kết bảo mật</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Mã hóa đầu cuối cho mọi cuộc hội thoại</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Không lưu trữ thông tin cá nhân nhạy cảm</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Tuân thủ các quy định về bảo vệ dữ liệu</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Chính sách & Điều khoản</h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/privacy")}
                  >
                    Xem Chính sách và Điều khoản
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">
              6. Hỗ trợ và tài liệu thêm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold">Kênh hỗ trợ</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span>📧</span>
                    <span>Email: support@example.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>💬</span>
                    <span>Live chat: 24/7</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📞</span>
                    <span>Hotline: 1900-xxxx</span>
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Tài liệu hữu ích</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Hướng dẫn sử dụng chi tiết
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Video hướng dẫn
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-blue-600 hover:underline">
                      Câu hỏi thường gặp
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-2xl">7. Bắt đầu trải nghiệm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-gray-600 mb-6">
                Hãy thử trải nghiệm chatbot ngay hôm nay và để lại góp ý cho
                chúng tôi để cải thiện hệ thống tốt hơn!
              </p>
              <div className="space-x-4">
                <Button
                  size="lg"
                  aria-label="Bắt đầu chat với chatbot"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => router.push("/")}
                >
                  Bắt đầu chat ngay
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
