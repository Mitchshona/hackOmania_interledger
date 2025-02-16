"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation" // ✅ Extract username from URL
import Image from "next/image"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/app/config/firebase-config"
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore"

export default function ProfileInfo() {
  const { username } = useParams() // ✅ Get `username` from URL path
  const [name, setName] = useState<string>("Loading...")
  const [bio, setBio] = useState<string>("")
  const [avatar, setAvatar] = useState<string>("/placeholder.svg?height=128&width=128") // Default avatar
  const [editingName, setEditingName] = useState<boolean>(false)
  const [editingBio, setEditingBio] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  // ✅ Fetch user details from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)

      // // ✅ Retrieve user from localStorage
      // const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      // if (!currentUser?.id) {
      //   console.error("User not found. Please sign in.")
      //   return
      // }

      try {
        let targetUsername = username // ✅ Use username from URL

        if (!targetUsername) {
          console.error("Username not found.")
          return
        }

        // ✅ Fetch user data by `userName` (instead of `userId`)
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("userName", "==", targetUsername))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          setName(userData.userName || "Unknown User")
          setAvatar(userData.avatar || "/placeholder.svg?height=128&width=128")
          setBio(userData.bio || "No bio available.")

        
        } else {
          console.error("User document not found.")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value)
  }

  return (
    <div className="bg-white shadow-[0_0_20px_rgba(0,0,0,0.15)] rounded-lg p-6 mb-6">
      {loading ? (
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            {/* Avatar skeleton */}
            <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
          </div>
          <div className="flex-grow space-y-4">
            {/* Name skeleton */}
            <div className="flex items-center">
              <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
              <div className="ml-2 h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
            </div>
            {/* Bio skeleton */}
            <div className="flex items-center">
              <div className="h-20 w-full bg-gray-200 rounded-md animate-pulse" />
              <div className="ml-2 h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <Image
              src={avatar}
              alt="Profile Picture"
              width={128}
              height={128}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-grow">
            {editingName ? (
              <Input
                value={name}
                onChange={handleNameChange}
                onBlur={() => setEditingName(false)}
                className="text-2xl font-bold mb-2"
              />
            ) : (
              <h1 className="text-2xl font-bold mb-2 flex items-center">
                {name}
                <Button variant="ghost" size="sm" onClick={() => setEditingName(true)} className="ml-2">
                  <Pencil size={16} />
                </Button>
              </h1>
            )}
            {editingBio ? (
              <Textarea
                value={bio}
                onChange={handleBioChange}
                onBlur={() => setEditingBio(false)}
                className="text-gray-600"
              />
            ) : (
              <p className="text-gray-600 flex items-center">
                {bio}
                <Button variant="ghost" size="sm" onClick={() => setEditingBio(true)} className="ml-2">
                  <Pencil size={16} />
                </Button>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
