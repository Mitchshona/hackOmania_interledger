const posts = [
    { id: 1, content: "Just launched my new project!", likes: 42, comments: 5 },
    { id: 2, content: "Beautiful day for a hike!", likes: 23, comments: 3 },
    { id: 3, content: "Learning Next.js is so much fun!", likes: 17, comments: 2 },
  ]
  
  export default function UserPosts() {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">My Posts</h2>
        {posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
            <p className="text-gray-800 mb-4">{post.content}</p>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="mr-4">{post.likes} likes</span>
              <span>{post.comments} comments</span>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  