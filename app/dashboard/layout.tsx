"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home, Upload, Settings, Menu, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AudioPlayer } from "@/components/audio-player"

const sidebarItems = [
  { href: "/dashboard", label: "홈", icon: Home },
  { href: "/dashboard/upload", label: "업로드", icon: Upload },
  { href: "/dashboard/settings", label: "설정", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-blue-600">Alone</h1>
          </div>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex flex-col h-full pt-16 md:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-0">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Audio Player */}
      <AudioPlayer />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
