"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, PlayCircle, PauseCircle, AlertTriangle } from "lucide-react"
import api from "@/lib/api"

interface Sentence {
  id: string;
  text: string;
  audio_url: string;
}

interface NovelDetails {
  id: string;
  title: string;
  status: string;
  sentences: Sentence[];
}

export default function NovelPage() {
  const [novel, setNovel] = useState<NovelDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSentenceId, setCurrentSentenceId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const params = useParams()
  const router = useRouter()
  const novelId = params.id as string

  useEffect(() => {
    if (!novelId) return;

    const fetchNovelDetails = async () => {
      try {
        // SRS: 
        // - GET /api/novels/{id} -> data: NovelDetails (id, title, status, full_audio_url? ...)
        // - GET /api/novels/{id}/sentences -> data: Sentence[]
        const novelData = await api<NovelDetails>(`/api/novels/${novelId}`)
        const sentences = await api<Sentence[]>(`/api/novels/${novelId}/sentences`)
        setNovel({ ...novelData, sentences })
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("소설 정보를 불러오는데 실패했습니다.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchNovelDetails()
  }, [novelId])

  const handleSentenceClick = (sentence: Sentence) => {
    if (audioRef.current && currentSentenceId === sentence.id) {
      if (audioRef.current.paused) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const newAudio = new Audio(sentence.audio_url)
      audioRef.current = newAudio
      newAudio.play()
      setCurrentSentenceId(sentence.id)
      newAudio.onended = () => setCurrentSentenceId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2">소설을 불러오는 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 flex flex-col items-center">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p>{error}</p>
        <Button onClick={() => router.back()} className="mt-4">뒤로가기</Button>
      </div>
    )
  }

  if (!novel) {
    return <div className="text-center">소설을 찾을 수 없습니다.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{novel.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {novel.sentences.map((sentence) => (
            <div 
              key={sentence.id}
              onClick={() => handleSentenceClick(sentence)}
              className="p-3 rounded-md cursor-pointer hover:bg-gray-100 flex items-center gap-3"
            >
              {currentSentenceId === sentence.id && audioRef.current && !audioRef.current.paused ? (
                <PauseCircle className="h-5 w-5 text-blue-500" />
              ) : (
                <PlayCircle className="h-5 w-5 text-gray-500" />
              )}
              <p className="flex-1">{sentence.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
