"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Novel {
  id: number
  title: string
  content: string
}

interface AudioContextType {
  isPlayerVisible: boolean
  currentNovel: Novel | null
  isPlaying: boolean
  progress: number
  currentTime: string
  totalTime: string
  showPlayer: (novel: Novel) => void
  hidePlayer: () => void
  togglePlayPause: () => void
  setProgress: (progress: number) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)
  const [currentNovel, setCurrentNovel] = useState<Novel | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgressState] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [totalTime, setTotalTime] = useState("0:00")

  const showPlayer = (novel: Novel) => {
    setCurrentNovel(novel)
    setIsPlayerVisible(true)
    setIsPlaying(true)
    setProgressState(0)
    setCurrentTime("0:00")
    // 실제 구현에서는 소설 길이에 따라 총 시간 계산
    setTotalTime("15:30")
  }

  const hidePlayer = () => {
    setIsPlayerVisible(false)
    setCurrentNovel(null)
    setIsPlaying(false)
    setProgressState(0)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const setProgress = (newProgress: number) => {
    setProgressState(newProgress)
    // 실제 구현에서는 진행률에 따라 현재 시간 계산
    const minutes = Math.floor((newProgress / 100) * 15.5)
    const seconds = Math.floor(((newProgress / 100) * 15.5 - minutes) * 60)
    setCurrentTime(`${minutes}:${seconds.toString().padStart(2, '0')}`)
  }

  return (
    <AudioContext.Provider
      value={{
        isPlayerVisible,
        currentNovel,
        isPlaying,
        progress,
        currentTime,
        totalTime,
        showPlayer,
        hidePlayer,
        togglePlayPause,
        setProgress,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}