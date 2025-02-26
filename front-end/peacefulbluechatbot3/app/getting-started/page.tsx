import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from '../../components/Header';
import { AppSidebar } from '../../components/Sidebar';

export default function GettingStartedPage() {
  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1">
        <Header />
        <h1 className="text-3xl font-bold mb-6">Getting Started</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome to our Chatbot</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Follow these steps to get started with our chatbot:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Navigate to the home page</li>
              <li>Type your question in the chat input</li>
              <li>Press enter or click the send button</li>
              <li>Wait for the chatbot's response</li>
            </ol>
            <Button className="mt-4">Start Chatting</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
