"use client"

import { useState, useEffect } from "react"

interface TrackerData {
  targetCount: number
  lastCompletedDate: string
  streakCount: number
}

export function usePushupTracker() {
  const [targetCount, setTargetCount] = useState(10)
  const [streakCount, setStreakCount] = useState(0)
  const [completedToday, setCompletedToday] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const today = new Date().toDateString()

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("yaduPushupTracker")
    if (savedData) {
      const data: TrackerData = JSON.parse(savedData)
      setTargetCount(data.targetCount)
      setStreakCount(data.streakCount)

      // Check if today is already completed
      if (data.lastCompletedDate === today) {
        setCompletedToday(true)
      } else {
        // Check if streak should be reset (missed a day)
        const lastCompleted = new Date(data.lastCompletedDate)
        const todayDate = new Date(today)
        const daysDiff = Math.floor((todayDate.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff > 1) {
          // Reset streak if more than 1 day has passed
          setStreakCount(0)
          saveData(data.targetCount, data.lastCompletedDate, 0)
        }
      }
    }
    setIsLoading(false)
  }, [today])

  const saveData = (target: number, lastDate: string, streak: number) => {
    const data: TrackerData = {
      targetCount: target,
      lastCompletedDate: lastDate,
      streakCount: streak,
    }
    localStorage.setItem("yaduPushupTracker", JSON.stringify(data))
  }

  const completeToday = async () => {
    if (completedToday || isCompleting) return

    setIsCompleting(true)

    // Simulate a brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newStreak = streakCount + 1
    const newTarget = targetCount + 1

    setCompletedToday(true)
    setStreakCount(newStreak)
    setTargetCount(newTarget)

    // Save to localStorage
    saveData(newTarget, today, newStreak)

    setIsCompleting(false)
  }

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      setTargetCount(10)
      setStreakCount(0)
      setCompletedToday(false)
      localStorage.removeItem("yaduPushupTracker")
    }
  }

  return {
    targetCount,
    streakCount,
    completedToday,
    isCompleting,
    isLoading,
    completeToday,
    resetProgress,
  }
}
