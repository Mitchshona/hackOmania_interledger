import ProfileInfo from "@/components/ProfileInfo";
import StreakCard from "@/components/StreakCard";
import UserPosts from "@/components/UserPosts";
import Challenges from "@/components/challenge/Challenges";

export default function ProfilePage() {
  return (
    <main className="container mx-auto px-4 pt-8 pb-8">
      <ProfileInfo />
      <StreakCard averageScreentime={0} />
      <UserPosts />
      <Challenges />
    </main>
  );
}
