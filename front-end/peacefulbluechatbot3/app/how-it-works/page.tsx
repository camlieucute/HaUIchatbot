import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Header from '../../components/Header';
import { AppSidebar } from '../../components/Sidebar';

export default function HowItWorksPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">How it Works?</h1>
          <div className="grid md:grid-cols-3 gap-6">
            {["Input Processing", "AI Analysis", "Response Generation"].map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    {step}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <ArrowRight className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
