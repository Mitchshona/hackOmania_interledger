'use client'

import { useState, useEffect } from "react"
import { FeedPost } from "@/components/feed/FeedPost"
import { ImageUploadButton } from "@/components/feed/ImageUploadButton"
import Navbar from "@/components/ui/navbar"
import { db } from "@/app/config/firebase-config"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

// Define the Post type
interface Post {
  id: string  // Firebase document ID (was number, changed to string)
  user: string
  avatar: string
  image: string
  caption: string
  likes: number
  comments: number
  donations: number
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsCollection = collection(db, "posts")
      const q = query(postsCollection, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const fetchedPosts: Post[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        user: doc.data().user || "Unknown User",
        avatar: doc.data().avatar || "/placeholder.svg?height=40&width=40",
        image: doc.data().image || "",
        caption: doc.data().caption || "",
        likes: doc.data().likes || 0,
        comments: doc.data().comments || 0,
        donations: doc.data().donations || 0,
      }));

      setPosts(fetchedPosts)
    } catch (error) {
      setError("Failed to get posts")
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex">
        <h1 className="text-3xl font-bold mb-6 mr-3">Social Feed</h1>
        <ImageUploadButton onPostUploaded={fetchPosts} />
      </div>
      {loading && <p>Loading Posts. Please Wait...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-8">
        {posts.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
      </div>
    </main>
  )
}
