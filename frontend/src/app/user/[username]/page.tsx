import ProfileInfo from "@/components/ProfileInfo"
import StreakCard from "@/components/StreakCard"
import UserPosts from "@/components/UserPosts"
import Navbar from "@/components/ui/navbar"

export default function ProfilePage({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  return (
    <main className="container mx-auto px-4 pt-8 pb-8">
      {searchParams.success === 'true' && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700" role="alert">
          <p className="font-medium">Successfully made donation!</p>
        </div>
      )}
      <ProfileInfo/>
      <StreakCard averageScreentime={0} />
      <UserPosts />
    </main>
  )
}
