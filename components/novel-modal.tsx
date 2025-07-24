"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"

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
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState<string[]>([])
  const [playingSentence, setPlayingSentence] = useState<string | null>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  // 텍스트를 페이지별로 나누는 함수
  const splitTextIntoPages = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const pagesArray: string[] = []
    let currentPageText = ""
    const maxLinesPerPage = 20 // 페이지당 최대 줄 수
    const maxCharsPerLine = 50 // 줄당 최대 문자 수

    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim() + "."
      const estimatedLines = Math.ceil(trimmedSentence.length / maxCharsPerLine)
      const currentLines = Math.ceil(currentPageText.length / maxCharsPerLine)

      if (currentLines + estimatedLines > maxLinesPerPage && currentPageText.length > 0) {
        pagesArray.push(currentPageText.trim())
        currentPageText = trimmedSentence + " "
      } else {
        currentPageText += trimmedSentence + " "
      }
    })

    if (currentPageText.trim().length > 0) {
      pagesArray.push(currentPageText.trim())
    }

    return pagesArray
  }

  useEffect(() => {
    if (novel.content) {
      const splitPages = splitTextIntoPages(novel.content)
      setPages(splitPages)
      setCurrentPage(0)
    }
  }, [novel.content])

  const handleSentenceClick = (sentence: string) => {
    if (playingSentence === sentence) {
      setPlayingSentence(null)
      // Stop audio
    } else {
      setPlayingSentence(sentence)
      // Play TTS audio for this sentence
      setTimeout(() => {
        setPlayingSentence(null)
      }, 2000) // Simulate audio duration
    }
  }

  const renderPageWithClickableSentences = (pageText: string) => {
    const sentences = pageText.split(/([.!?]+)/).filter((s) => s.trim().length > 0)
    const sentencePairs: string[] = []

    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i]
      const punctuation = sentences[i + 1] || ""
      if (sentence && sentence.trim().length > 0) {
        sentencePairs.push(sentence.trim() + punctuation)
      }
    }

    return sentencePairs.map((sentence, index) => (
      <span
        key={index}
        className={`cursor-pointer transition-colors inline ${
          playingSentence === sentence ? "bg-blue-200 text-blue-800 rounded px-1" : "hover:bg-gray-100 rounded px-1"
        }`}
        onClick={() => handleSentenceClick(sentence)}
      >
        {sentence}{" "}
      </span>
    ))
  }

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {novel.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[70vh]">
          {/* Book Page */}
          <div className="flex-1 relative">
            <div className="h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-inner border-2 border-amber-200 p-8 overflow-hidden">
              {/* Page Content */}
              <div
                ref={pageRef}
                className="h-full overflow-hidden text-gray-800 leading-relaxed text-base font-serif"
                style={{
                  textAlign: "justify",
                  lineHeight: "1.8",
                  fontSize: "16px",
                }}
              >
                {pages[currentPage] && renderPageWithClickableSentences(pages[currentPage])}
              </div>

              {/* Page Number */}
              <div className="absolute bottom-4 right-6 text-sm text-gray-500 font-serif">
                {currentPage + 1} / {pages.length}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-4 px-4">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              이전 페이지
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                페이지 {currentPage + 1} / {pages.length}
              </span>
              {playingSentence && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Play className="h-4 w-4" />
                  재생 중...
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === pages.length - 1}
              className="flex items-center gap-2 bg-transparent"
            >
              다음 페이지
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Close Button */}
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={onClose}>
              책 닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}