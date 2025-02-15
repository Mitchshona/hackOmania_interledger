"use client"

import { Flame } from "lucide-react"

interface StreakCard {
  streakCount: number
  averageScreentime: number
}

const StreakCard = ({ streakCount = 0, averageScreentime = 30 }: StreakCard) => {
  return (
    <div 
      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 shadow-sm mb-4"
      role="status"
      aria-label={`Current streak: ${streakCount} days, Average screentime: ${averageScreentime} minutes`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
          <Flame className="h-6 w-6 text-orange-500" aria-hidden="true" />
        </div>
        
        <div className="flex flex-col">
          <p className="text-2xl font-bold text-foreground">
            {streakCount} {streakCount === 1 ? 'day' : 'days'}
          </p>
          <p className="text-sm text-muted-foreground">
            Current streak
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <span className="text-lg font-semibold text-blue-600">{averageScreentime}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Avg. mins
        </p>
      </div>
    </div>
  )
}

export default StreakCard