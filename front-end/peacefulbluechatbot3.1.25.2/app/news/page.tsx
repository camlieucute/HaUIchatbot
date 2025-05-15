"use client";

import React, { useState } from 'react';
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/shared/header";
import Link from "next/link";
import { newsItems } from "@/data/news";
import { Input } from "@/components/ui/input";

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("Tất cả");

  const categories = [
    "Tất cả",
    "Tin tức",
    "Sự kiện",
    "Hoạt động sinh viên & Khởi nghiệp",
    "Hoạt động khoa học công nghệ",
    "Câu lạc bộ",
  ];

  const filteredNewsItems = newsItems.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(lowerCaseQuery) ||
      item.summary.toLowerCase().includes(lowerCaseQuery);
    
    const matchesCategory = activeTab === "Tất cả" || item.category === activeTab;
    
    if (searchQuery) {
        return matchesSearch && matchesCategory;
    } 
    return matchesCategory;
  });

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Điểm tin hoạt động
          </h1>
          <p className="text-gray-600 text-lg dark:text-gray-300">
            Cập nhật những tin tức và hoạt động nổi bật của Trường Đại học Công
            nghiệp Hà Nội
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-10 max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 dark:text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <Input
          type="text"
          placeholder="Tìm kiếm điểm tin..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-xl text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
          />
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full flex-wrap h-auto justify-center">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="px-4 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredNewsItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNewsItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col h-full bg-white dark:bg-gray-800 group"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        />
                      </div>
                      <div className="flex flex-col flex-grow p-5">
                        <CardHeader className="p-0 mb-3">
                          <Badge 
                            className="mb-2 self-start text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100"
                          >
                            {item.category}
                          </Badge>
                          <CardTitle className="text-lg font-bold leading-tight line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-grow">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {item.date}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 flex-grow mb-4">
                            {item.summary}
                          </p>
                        </CardContent>
                        <div className="mt-auto pt-4">
                          <Link href={`/news/${item.id}`} passHref legacyBehavior>
                            <Button 
                              variant="outline" 
                              className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white transition-colors duration-200"
                            >
                              Đọc chi tiết
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-xl text-gray-500 dark:text-gray-400">Không tìm thấy điểm tin nào.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}