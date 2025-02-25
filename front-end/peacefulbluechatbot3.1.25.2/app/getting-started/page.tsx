import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { Header } from "@/components/shared/header"

export default function GettingStartedPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Hướng Dẫn Sử Dụng Chatbot
          </h1>
          <p className="text-gray-600 text-lg">Trợ lý thông minh hỗ trợ hoạt động Đoàn - Hội - Đội</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">1. Giới thiệu tổng quan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="font-semibold mb-3">Mục đích</h3>
                  <p className="text-gray-600 mb-4">
                    Chatbot được phát triển nhằm hỗ trợ giải đáp thắc mắc về chính sách, 
                    hoạt động, sự kiện của Đoàn, Hội, Đội một cách nhanh chóng và hiệu quả.
                  </p>
                  <h3 className="font-semibold mb-3">Lợi ích</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Trả lời nhanh chóng và chính xác</li>
                    <li>Hỗ trợ 24/7</li>
                    <li>Tiết kiệm thời gian tra cứu</li>
                    <li>Cập nhật thông tin liên tục</li>
                  </ul>
                </div>
                <div className="md:w-1/3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">Thống kê</h4>
                    <div className="space-y-2">
                      <p className="text-sm">✨ Hơn 1000+ câu hỏi được trả lời</p>
                      <p className="text-sm">🎯 Độ chính xác trên 95%</p>
                      <p className="text-sm">⚡ Phản hồi trong 2 giây</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">2. Bắt đầu nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-2">Các bước cơ bản</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Nhấn nút "Bắt đầu chat"</li>
                    <li>Gõ câu hỏi của bạn</li>
                    <li>Nhấn Enter hoặc nút Gửi</li>
                    <li>Nhận câu trả lời ngay lập tức</li>
                  </ol>
                </div>
                <Button className="w-full">Bắt đầu chat ngay</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="features" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="features">Tính năng</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="advanced">Hướng dẫn nâng cao</TabsTrigger>
            <TabsTrigger value="support">Hỗ trợ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>3. Tính năng và khả năng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Danh sách tính năng</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Hỗ trợ tra cứu nội quy, chính sách</li>
                      <li>Thông tin về lịch trình, sự kiện</li>
                      <li>Cập nhật tin tức mới nhất</li>
                      <li>Tích hợp đa nền tảng</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Câu hỏi mẫu</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>"Lịch họp Đoàn tháng này?"</p>
                      <p>"Thủ tục đăng ký tham gia sự kiện?"</p>
                      <p>"Điều kiện kết nạp Đoàn?"</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>4. Câu hỏi thường gặp</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="border-b pb-4">
                        <h3 className="font-semibold mb-2">Làm gì khi chatbot không trả lời được câu hỏi?</h3>
                        <p className="text-gray-600">
                          Bạn có thể thử diễn đạt lại câu hỏi một cách rõ ràng hơn hoặc liên hệ trực tiếp với 
                          đội ngũ hỗ trợ qua email support@example.com
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>5. Hướng dẫn sử dụng nâng cao</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Cách tương tác hiệu quả</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Sử dụng câu hỏi ngắn gọn, rõ ràng</li>
                      <li>Cung cấp đầy đủ thông tin cần thiết</li>
                      <li>Sử dụng từ khóa chính xác</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-700 mb-3">Mẹo tối ưu</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>💡 Sử dụng ngôn ngữ tự nhiên</p>
                      <p>💡 Kiểm tra chính tả</p>
                      <p>💡 Phân loại rõ chủ đề câu hỏi</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>6. Hỗ trợ và giải đáp vấn đề</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Liên hệ hỗ trợ</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>📧 Email: support@example.com</p>
                      <p>📞 Hotline: 1900-xxxx</p>
                      <p>🌐 Website: www.example.com</p>
                    </div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-700 mb-3">Xử lý sự cố</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Làm mới trang web</li>
                      <li>Kiểm tra kết nối mạng</li>
                      <li>Xóa cache trình duyệt</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>7. Tài liệu tham khảo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-3">Tài liệu hướng dẫn</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Hướng dẫn sử dụng chi tiết</li>
                    <li>Video tutorial</li>
                    <li>Tài liệu API</li>
                  </ul>
                </div>
                <Button variant="outline" className="w-full">
                  Xem tất cả tài liệu
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Lời kết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Chatbot là công cụ hỗ trợ đắc lực trong các hoạt động Đoàn - Hội - Đội. 
                  Chúng tôi luôn lắng nghe góp ý của bạn để cải thiện hệ thống ngày càng tốt hơn.
                </p>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-700 mb-2">Góp ý của bạn</h3>
                  <p className="text-gray-600">
                    Mọi ý kiến đóng góp xin gửi về email: feedback@example.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
