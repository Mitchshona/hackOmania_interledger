"use client";

import { useState, useEffect } from "react";
import { VerifyImageModal } from "./profile/VerifyImageModal";

const posts = [
  { id: 1, content: "Just launched my new project!", likes: 42, comments: 5 },
  { id: 2, content: "Beautiful day for a hike!", likes: 23, comments: 3 },
  { id: 3, content: "Learning Next.js is so much fun!", likes: 17, comments: 2 },
];

export default function UserPosts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handlePostUploaded = async () => {
    console.log("Post uploaded! Refreshing data...");
    // Add logic to refresh posts if needed
  };

  // Check if user is authenticated by looking for currentUser in localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Loading state until authentication status is known
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Records</h2>
        {/* Show button only if user is authenticated */}
        {isAuthenticated && (
          <button
            onClick={handleOpenModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Verify Image
          </button>
        )}
      </div>

      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-800 mb-4">{post.content}</p>
          <div className="flex items-center text-gray-500 text-sm">
            <span className="mr-4">{post.likes} likes</span>
            <span>{post.comments} comments</span>
          </div>
        </div>
      ))}

      {/* Modal Component */}
      <VerifyImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPostUploaded={handlePostUploaded}
      />
    </div>
  );
}
