import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/shared/header"
import Link from "next/link"

export default function NewsPage() {
  const categories = [
    "Tất cả",
    "Tin tức Đoàn",
    "Hoạt động",
    "Cuộc thi",
    "Tình nguyện",
    "Giáo dục"
  ]

  const newsItems = [
    {
      id: 1,
      title: "Đại hội đại biểu Đoàn TNCS Hồ Chí Minh tỉnh lần thứ XI",
      date: "25/02/2025",
      summary: "Đại hội đã thông qua nhiều nội dung quan trọng và bầu ra Ban Chấp hành nhiệm kỳ mới. Các đại biểu đã thảo luận về phương hướng hoạt động và các giải pháp phát triển trong giai đoạn tới.",
      category: "Tin tức Đoàn",
      image: "/images/news/daihoi.jpg",
      link: "/news/1"
    },
    {
      id: 2,
      title: "Chiến dịch Mùa hè xanh 2025 được phát động",
      date: "20/02/2025",
      summary: "Hàng ngàn sinh viên tình nguyện sẽ tham gia các hoạt động cộng đồng, hỗ trợ người dân địa phương trong các lĩnh vực: xây dựng nông thôn mới, bảo vệ môi trường, và hỗ trợ giáo dục.",
      category: "Tình nguyện",
      image: "/images/news/muahexanh.jpg",
      link: "/news/2"
    },
    {
      id: 3,
      title: "Hội thi Tin học trẻ toàn quốc 2025",
      date: "15/02/2025",
      summary: "Cuộc thi nhằm phát hiện, bồi dưỡng tài năng trẻ trong lĩnh vực công nghệ thông tin. Năm nay có sự tham gia của hơn 1000 thí sinh đến từ 63 tỉnh thành.",
      category: "Cuộc thi",
      image: "/images/news/tinhoctre.jpg",
      link: "/news/3"
    },
    {
      id: 4,
      title: "Chương trình 'Tiếp sức đến trường' hỗ trợ tân sinh viên",
      date: "18/02/2025",
      summary: "Đoàn Thanh niên các trường đại học trên địa bàn thành phố tổ chức chương trình hỗ trợ tân sinh viên nhập học, tìm nhà trọ và định hướng học tập.",
      category: "Hoạt động",
      link: "/news/4"
    },
    {
      id: 5,
      title: "Tập huấn kỹ năng tổ chức hoạt động Đoàn - Hội",
      date: "12/02/2025",
      summary: "Chương trình tập huấn dành cho cán bộ Đoàn - Hội các cấp, trang bị kiến thức và kỹ năng tổ chức hoạt động hiệu quả.",
      category: "Giáo dục",
      link: "/news/5"
    },
    {
      id: 6,
      title: "Phát động cuộc thi Ý tưởng sáng tạo vì cộng đồng",
      date: "10/02/2025",
      summary: "Cuộc thi nhằm tìm kiếm những ý tưởng sáng tạo của đoàn viên, thanh niên trong việc giải quyết các vấn đề xã hội.",
      category: "Cuộc thi",
      link: "/news/6"
    },
    {
      id: 7,
      title: "Triển khai chương trình 'Thắp sáng ước mơ'",
      date: "08/02/2025",
      summary: "Chương trình học bổng hỗ trợ học sinh, sinh viên có hoàn cảnh khó khăn vươn lên trong học tập.",
      category: "Hoạt động",
      link: "/news/7"
    },
    {
      id: 8,
      title: "Hội nghị tổng kết công tác Đoàn và phong trào thanh thiếu nhi năm 2024",
      date: "05/02/2025",
      summary: "Đánh giá kết quả đạt được trong năm 2024 và đề ra phương hướng hoạt động cho năm 2025.",
      category: "Tin tức Đoàn",
      link: "/news/8"
    },
    {
      id: 9,
      title: "Ra mắt Câu lạc bộ Khởi nghiệp trẻ",
      date: "03/02/2025",
      summary: "Nơi kết nối, chia sẻ kinh nghiệm và hỗ trợ thanh niên trong hành trình khởi nghiệp.",
      category: "Hoạt động",
      link: "/news/9"
    }
  ]

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Điểm tin hoạt động
          </h1>
          <p className="text-gray-600 text-lg">
            Cập nhật những tin tức và hoạt động nổi bật của Đoàn, Hội, Đội
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="Tất cả" className="mb-8">
          <TabsList className="w-full flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-4 py-2"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {newsItems
                  .filter(item => category === "Tất cả" || item.category === category)
                  .map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      <CardHeader className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {item.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{item.date}</span>
                        </div>
                        <CardTitle className="line-clamp-2 text-xl">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                          {item.summary}
                        </p>
                        <Link href={item.link} passHref>
                          <Button variant="outline" className="w-full">
                            Đọc chi tiết
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  )
}
