"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

interface Novel {
  id: number
  title: string
  content: string
}

interface NovelModalProps {
  novel: Novel
  isOpen: boolean
  onClose: () => void
}

export function NovelModal({ novel, isOpen, onClose }: NovelModalProps) {
  const [playingSentence, setPlayingSentence] = useState<number | null>(null)

  const sentences = novel.content.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  const handleSentenceClick = (index: number) => {
    if (playingSentence === index) {
      setPlayingSentence(null)
      // Stop audio
    } else {
      setPlayingSentence(index)
      // Play TTS audio for this sentence
      setTimeout(() => {
        setPlayingSentence(null)
      }, 2000) // Simulate audio duration
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{novel.title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-4">
          {sentences.map((sentence, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                playingSentence === index
                  ? "bg-blue-100 border-2 border-blue-300"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
              onClick={() => handleSentenceClick(index)}
            >
              <div className="flex items-center gap-2">
                {playingSentence === index ? (
                  <Pause className="h-4 w-4 text-blue-600" />
                ) : (
                  <Play className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm leading-relaxed">{sentence.trim()}.</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
