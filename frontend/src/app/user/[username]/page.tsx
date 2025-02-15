import ProfileInfo from "@/components/ProfileInfo"
import StreakCard from "@/components/StreakCard"
import UserPosts from "@/components/UserPosts"
import Navbar from "@/components/ui/navbar"

export default function ProfilePage() {
  return (
    <main className="container mx-auto px-4 pt-8 pb-8">
      <ProfileInfo/>
      <StreakCard streakCount={0} averageScreentime={0} />
      <UserPosts />
    </main>
  )
}

