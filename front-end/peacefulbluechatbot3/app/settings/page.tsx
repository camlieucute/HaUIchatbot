"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import Header from '../../components/Header';
import { AppSidebar } from '../../components/Sidebar';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="flex">
      <AppSidebar />
      <div className="flex-1">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="flex flex-col">
                    <span className="font-medium">Notifications</span>
                    <span className="text-sm text-gray-500">Receive updates and alerts</span>
                  </Label>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode" className="flex flex-col">
                    <span className="font-medium">Dark Mode</span>
                    <span className="text-sm text-gray-500">Use dark theme</span>
                  </Label>
                  <Switch id="darkMode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button className="w-full">Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
