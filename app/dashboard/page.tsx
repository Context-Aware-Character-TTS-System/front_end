"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Play, Trash2, Calendar, Loader2 } from 'lucide-react'
import { NovelModal } from "@/components/novel-modal"
import api from "@/lib/api"

interface Novel {
  id: string;
  title: string;
  created_at: string;
  status: 'done' | 'processing' | 'pending' | 'error';
  content?: string;
}

export default function DashboardPage() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNovel, setSelectedNovel] = useState<Novel | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      router.push("/")
      return
    }

    const fetchNovels = async () => {
      try {
        // SRS: GET /api/novels returns data: Novel[]
        const response = await api<Novel[]>("/api/novels")
        setNovels(response)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchNovels()
  }, [router])

  const getStatusText = (status: Novel['status']) => {
    const statusMap = {
      done: "완료됨",
      processing: "처리 중",
      pending: "대기 중",
      error: "오류",
    }
    return statusMap[status]
  }

  const getStatusColor = (status: Novel['status']) => {
    const colorMap = {
      done: "bg-green-100 text-green-800",
      processing: "bg-yellow-100 text-yellow-800",
      pending: "bg-blue-100 text-blue-800",
      error: "bg-red-100 text-red-800",
    }
    return colorMap[status]
  }

  const handlePlayAll = () => {
    alert("전체 듣기 기능은 구현 예정입니다.")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">소설 목록을 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 소설</h1>
        <p className="text-gray-600">업로드한 소설들을 관리하고 오디오북을 생성하세요</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {novels.map((novel) => (
          <Card key={novel.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{novel.title}</CardTitle>
                <Badge className={getStatusColor(novel.status)}>{getStatusText(novel.status)}</Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {new Date(novel.created_at).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/novels/${novel.id}`)}>
                  <Eye className="h-4 w-4 mr-1" />
                  보기
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={novel.status !== "done"}
                  onClick={() => handlePlayAll()}
                >
                  <Play className="h-4 w-4 mr-1" />
                  전체 듣기
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedNovel && (
        <NovelModal novel={selectedNovel} isOpen={!!selectedNovel} onClose={() => setSelectedNovel(null)} />
      )}
    </div>
  )
}
