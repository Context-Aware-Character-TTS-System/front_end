"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react'
import { useAudio } from "@/contexts/audio-context"

export function AudioPlayer() {
  const { 
    currentNovel, 
    isPlaying, 
    progress, 
    currentTime, 
    totalTime, 
    togglePlayPause, 
    setProgress, 
    hidePlayer 
  } = useAudio()

  if (!currentNovel) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate mb-1">{currentNovel.title}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{currentTime}</span>
              <Progress 
                value={progress} 
                className="flex-1 cursor-pointer" 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const clickX = e.clientX - rect.left
                  const newProgress = (clickX / rect.width) * 100
                  setProgress(newProgress)
                }}
              />
              <span className="text-xs text-gray-500">{totalTime}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 ml-2"
              onClick={hidePlayer}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}