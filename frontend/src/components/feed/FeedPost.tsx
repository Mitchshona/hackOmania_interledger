import Image from "next/image"
import { Heart, MessageCircle, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"


interface Post {
  id: string
  user: string
  avatar: string
  image: string
  caption: string
  likes: number
  comments: number
  donations: number
}

interface FeedPostProps {
  post: Post
}

export function FeedPost({ post }: FeedPostProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex items-center">
        <Image
          src={post.avatar || "/placeholder.svg"}
          alt={post.user}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <span className="font-semibold">{post.user}</span>
      </div>
      <Image 
        src={post.image || "/placeholder.svg"} 
        alt="Post image" 
        width={400} 
        height={400} 
        className="w-full h-auto"
      />
      <div className="p-4">
        <p className="mb-4">{post.caption}</p>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm">
              <Heart className="w-5 h-5 mr-1" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-5 h-5 mr-1" />
              {post.comments}
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <DollarSign className="w-5 h-5 mr-1" />
            Donate ({post.donations})
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          Donations encourage less screen time and support digital well-being initiatives.
        </div>
      </div>
    </div>
  )
}

