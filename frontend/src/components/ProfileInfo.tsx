"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ProfileInfo() {
  const [name, setName] = useState("John Doe")
  const [bio, setBio] = useState("I love coding and building awesome things!")
  const [editingName, setEditingName] = useState(false)
  const [editingBio, setEditingBio] = useState(false)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Here you would typically upload the file to your server or a service like Supabase
      console.log("Uploading file:", file.name)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <Image
            src="/placeholder.svg?height=128&width=128"
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer"
          >
            <Pencil size={16} />
          </label>
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
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
    </div>
  )
}

