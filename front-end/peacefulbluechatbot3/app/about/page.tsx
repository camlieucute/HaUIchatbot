import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Header from '../../components/Header';
import { AppSidebar } from '../../components/Sidebar';

export default function AboutPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">About Our Chatbot</h1>
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-4 md:mb-0 md:mr-4">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Chatbot Illustration"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
                <div className="md:w-1/2">
                  <p className="mb-4">
                    Our chatbot is designed to provide quick and accurate information about Đoàn, Hội, Đội activities. We
                    aim to make it easier for members to access important information and stay connected with our
                    organization.
                  </p>
                  <p>
                    Developed by the Ho Chi Minh Communist Youth Union of Ba Dinh District, this chatbot leverages advanced
                    AI technology to serve our community better.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
