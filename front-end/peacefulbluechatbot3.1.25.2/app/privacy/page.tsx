"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/shared/header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PolicySection = ({ title, content }: { title: string; content: React.ReactNode }) => (
  <div>
    <h2 className="text-xl font-semibold text-blue-700 mb-2">{title}</h2>
    <div>{content}</div>
  </div>
);

export default function PolicyPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(true);

  useEffect(() => {
    const hasAgreed = localStorage.getItem("policyAgreed");
    if (hasAgreed === "true") {
      router.push("/");
    }
  }, [router]);

  const sections = [
    {
      title: "1. Chính Sách Bảo Mật",
      content:
        "Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân của người dùng. Mọi dữ liệu thu thập sẽ chỉ được sử dụng nhằm cải thiện chất lượng dịch vụ và sẽ không được chia sẻ với bất kỳ bên thứ ba nào khi chưa có sự đồng ý rõ ràng từ bạn.",
    },
    {
      title: "2. Chính Sách Sử Dụng",
      content:
        "Người dùng cam kết sử dụng trang web và dịch vụ vì mục đích hợp pháp, không xâm phạm đến quyền và lợi ích hợp pháp của tổ chức, cá nhân khác. Mọi hành vi can thiệp, phá hoại hệ thống hoặc sử dụng dịch vụ với mục đích vi phạm pháp luật đều bị nghiêm cấm.",
    },
    {
      title: "3. Điều Khoản Sử Dụng",
      content: (
        <>
          Khi sử dụng dịch vụ của chúng tôi, bạn mặc nhiên chấp thuận các điều khoản sau:
          <ul className="list-disc list-inside mt-2 space-y-1 text-base text-gray-700">
            <li>Tuân thủ đầy đủ các quy định pháp luật hiện hành.</li>
            <li>
              Không sử dụng dịch vụ vào mục đích vi phạm quyền sở hữu trí tuệ hoặc vi phạm pháp luật.
            </li>
            <li>
              Chúng tôi có quyền thay đổi, cập nhật hoặc ngừng cung cấp dịch vụ mà không cần thông báo trước.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Quyền Sở Hữu Trí Tuệ",
      content:
        "Toàn bộ nội dung hiển thị trên trang web này, bao gồm nhưng không giới hạn: văn bản, hình ảnh, biểu tượng, mã nguồn và phần mềm… đều thuộc quyền sở hữu của chúng tôi hoặc các bên đối tác liên kết, được bảo hộ theo quy định của pháp luật về sở hữu trí tuệ. Mọi hành vi sao chép, sử dụng lại trái phép đều bị nghiêm cấm.",
    },
    {
      title: "5. Thay Đổi Điều Khoản",
      content:
        "Chúng tôi có toàn quyền sửa đổi, bổ sung hoặc cập nhật nội dung các điều khoản này bất kỳ lúc nào mà không cần thông báo trước. Người dùng nên thường xuyên kiểm tra để nắm bắt những thay đổi mới nhất và đảm bảo quyền lợi của mình.",
    },
  ];

  const handleContinue = () => {
    localStorage.setItem("policyAgreed", "true");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="flex justify-center mb-6">
        <Header />
      </div>
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-gray-800">
              Chính Sách và Điều Khoản
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 text-justify text-gray-700 leading-relaxed">
            {sections.map((section, index) => (
              <PolicySection
                key={index}
                title={section.title}
                content={section.content}
              />
            ))}

            <div className="mt-8 border-t pt-6 space-y-4">
              <label htmlFor="agree" className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="accent-blue-600 w-5 h-5"
                />
                <span className="text-sm text-gray-700">
                  Tôi đã đọc và đồng ý với điều khoản sử dụng và chính sách bảo
                  mật
                </span>
              </label>

              <Button
                className="w-full"
                disabled={!agreed}
                onClick={handleContinue}
              >
                Tiếp tục
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
