import ProfileInfo from "@/components/ProfileInfo"
import UserPosts from "@/components/UserPosts"
import Navbar from "@/components/ui/navbar"

export default function ProfilePage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-8">
      <ProfileInfo />
      <UserPosts />
    </main>
  )
}

