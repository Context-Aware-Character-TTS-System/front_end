"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Play, Trash2, Calendar } from "lucide-react"
import { NovelModal } from "@/components/novel-modal"

const novels = [
  {
    id: 1,
    title: "해리포터와 마법사의 돌",
    uploadDate: "2024-01-15",
    status: "완료됨",
    content:
      "해리 포터는 11살이 되던 해에 자신이 마법사라는 사실을 알게 되었다. 그는 호그와트 마법학교에 입학하게 되었고, 그곳에서 론 위즐리와 헤르미온느 그레인저라는 친구들을 만났다.",
  },
  {
    id: 2,
    title: "어린왕자",
    uploadDate: "2024-01-10",
    status: "처리 중",
    content:
      "어느 날 나는 사하라 사막에서 비행기 고장으로 불시착했다. 그때 한 어린 소년을 만났는데, 그는 자신을 어린왕자라고 소개했다.",
  },
  {
    id: 3,
    title: "1984",
    uploadDate: "2024-01-08",
    status: "완료됨",
    content:
      "1984년 4월의 밝고 차가운 날이었다. 시계가 열세 시를 알리고 있었다. 윈스턴 스미스는 턱을 가슴에 파묻고 매서운 바람을 피하려 애쓰며 빅토리 맨션의 유리문 사이로 재빨리 몸을 밀어넣었다.",
  },
]

export default function DashboardPage() {
  const [selectedNovel, setSelectedNovel] = useState<(typeof novels)[0] | null>(null)

  const getStatusColor = (status: string) => {
    return status === "완료됨" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
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
                <Badge className={getStatusColor(novel.status)}>{novel.status}</Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {novel.uploadDate}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedNovel(novel)}>
                  <Eye className="h-4 w-4 mr-1" />
                  보기
                </Button>
                <Button variant="outline" size="sm" disabled={novel.status === "처리 중"}>
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
