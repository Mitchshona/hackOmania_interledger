"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Flame } from "lucide-react"
import { db } from "@/app/config/firebase-config"
import { collection, query, where, onSnapshot } from "firebase/firestore"

interface StreakCardProps {
  averageScreentime: number
}

const StreakCard = ({ averageScreentime = 30 }: StreakCardProps) => {
  const { username } = useParams()
  const [streakCount, setStreakCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = () => {
      if (!username) {
        console.error("Username not found in URL.")
        return
      }

      try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("userName", "==", username))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]
            const userData = userDoc.data()
            setStreakCount(userData.streak)
          } else {
            console.error(`User '${username}' not found in Firestore.`)
          }
        })

        return unsubscribe
      } catch (error) {
        console.error("Error fetching streak count:", error)
      } finally {
        setLoading(false)
      }
    }

    unsubscribe()
  }, [username])

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
            {loading ? "..." : `${streakCount} ${streakCount === 1 ? 'day' : 'days'}`}
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
