"use client"

import { useState, useEffect } from "react"
import { Trophy, RotateCcw, Target, Flame } from "lucide-react"

interface TrackerData {
  targetCount: number
  lastCompletedDate: string
  currentStreak: number
}

export default function PushupTracker() {
  const [targetCount, setTargetCount] = useState(10)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const today = new Date().toDateString()

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("pushupTracker")
    if (savedData) {
      const data: TrackerData = JSON.parse(savedData)
      setTargetCount(data.targetCount)
      setCurrentStreak(data.currentStreak)

      // Check if today is already completed
      if (data.lastCompletedDate === today) {
        setIsCompleted(true)
      } else {
        // Check if streak should be reset (missed a day)
        const lastCompleted = new Date(data.lastCompletedDate)
        const todayDate = new Date(today)
        const daysDiff = Math.floor((todayDate.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff > 1) {
          // Reset streak if more than 1 day has passed
          setCurrentStreak(0)
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
      currentStreak: streak,
    }
    localStorage.setItem("pushupTracker", JSON.stringify(data))
  }

  // ...existing code...

const playSuccessSound = () => {
  const audio = new Audio("/success.mp3")
  audio.play().catch((e) => {
    // Handle play error (e.g., user gesture required)
    console.log("Audio play failed:", e)
  })
}

// ...existing code...

  const handleComplete = () => {
    if (isCompleted) return

    const newStreak = currentStreak + 1
    const newTarget = targetCount + 1

    setIsCompleted(true)
    setCurrentStreak(newStreak)
    setTargetCount(newTarget)

    // Save to localStorage
    saveData(newTarget, today, newStreak)

    // Play success sound
    try {
      playSuccessSound()
    } catch (error) {
      console.log("Audio not supported or blocked")
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      setTargetCount(10)
      setCurrentStreak(0)
      setIsCompleted(false)
      localStorage.removeItem("pushupTracker")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💪 Pushup Tracker</h1>
          <p className="text-gray-600">Add one pushup daily. Watch your strength grow.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Target Count */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{targetCount}</div>
              <div className="text-sm text-gray-600">Today's Target</div>
            </div>
          </div>

          {/* Streak Count */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Completion Status */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
          <div className="text-center">
            {isCompleted ? (
              <div className="text-green-600">
                <Trophy className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2">Completed! 🎉</h2>
                <p className="text-gray-600">Great job! Come back tomorrow for {targetCount} pushups.</p>
              </div>
            ) : (
              <div className="text-gray-700">
                <div className="text-6xl font-bold mb-2">{targetCount}</div>
                <p className="text-lg">pushups to complete today</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Complete Button */}
          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 ${
              isCompleted
                ? "bg-green-100 text-green-600 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
          >
            {isCompleted ? "✅ Completed Today" : "🚀 Mark Complete"}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-3 px-6 rounded-2xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Progress
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Your progress is saved locally on this device</p>
        </div>
      </div>
    </div>
  )
}
