import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Header from '../../components/Header';
import { AppSidebar } from '../../components/Sidebar';

export default function FAQPage() {
  const faqs = [
    {
      question: "What is the purpose of this chatbot?",
      answer:
        "This chatbot is designed to provide information and assistance related to Đoàn, Hội, Đội activities in Ba Dinh District.",
    },
    {
      question: "How accurate is the information provided by the chatbot?",
      answer:
        "The chatbot's information is regularly updated and verified. However, for critical matters, we recommend confirming with official sources.",
    },
    {
      question: "Can I use the chatbot on mobile devices?",
      answer: "Yes, our chatbot is fully responsive and can be used on both desktop and mobile devices.",
    },
    {
      question: "How do I report an issue with the chatbot?",
      answer:
        "If you encounter any issues, please contact our support team through the 'Settings' page or email us at support@example.com.",
    },
  ]

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
