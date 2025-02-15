import { Flame } from "lucide-react"

interface StreakCard {
  streakCount: number
}

const StreakCard = ({ streakCount = 0 }: StreakCard) => {
  return (
    <div 
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
      role="status"
      aria-label={`Current streak: ${streakCount} days`}
    >
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
  )
}

export default StreakCard