'use client'

import { useState, useEffect } from "react"
import { FeedPost } from "@/components/feed/FeedPost"
import Navbar from "@/components/ui/navbar"
// Define the Post type
interface Post {
  id: number
  user: string
  avatar: string
  image: string
  caption: string
  likes: number
  comments: number
  donations: number
}

// Dummy data to use while Supabase is down
const dummyData: Post[] = [
  {
    id: 1,
    user: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    image: "/placeholder.svg?height=400&width=400",
    caption: "Enjoying a mindful moment! #wellness #mindfulness",
    likes: 120,
    comments: 45,
    donations: 20,
  },
  {
    id: 2,
    user: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    image: "/placeholder.svg?height=400&width=400",
    caption: "Exploring the power of gratitude. #gratitude #mindfulness",
    likes: 200,
    comments: 30,
    donations: 50,
  },
  // Add more dummy posts as needed
]

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    // Instead of fetching from Supabase, use dummy data for now
    setPosts(dummyData)
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6">Mindful Social Feed</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>
    </main>
  )
}

