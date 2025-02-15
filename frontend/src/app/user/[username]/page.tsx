import ProfileInfo from "@/components/ProfileInfo"
import UserPosts from "@/components/UserPosts"
import Navbar from "@/components/ui/navbar"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Navbar />
      <ProfileInfo />
      <UserPosts />
    </div>
  )
}

