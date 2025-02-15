"use client"

import type React from "react"

import { useState, useRef } from "react"
import axios from "axios"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImageUploadModal({ isOpen, onClose }: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSelectedFile(file)
      const imageUrl = URL.createObjectURL(file)
      setPreviewUrl(imageUrl)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload")
      return
    }

    setIsUploading(true)

    const formData = new FormData()
    formData.append("image", selectedFile)
    formData.append("caption", caption)

    try {
      const response = await axios.post("/api/upload-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log("Post uploaded successfully:", response.data)
      onClose()
      // You might want to refresh the feed or add the new post to the existing feed
    } catch (error) {
      console.error("Error uploading post:", error)
      alert("Failed to upload post. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setCaption("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose()
        resetForm()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="col-span-3"
              ref={fileInputRef}
            />
          </div>
          {previewUrl && (
            <div className="mt-4">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Selected image preview"
                width={300}
                height={300}
                className="rounded-md object-cover"
              />
            </div>
          )}
          <Textarea placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onClose()
              resetForm()
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
            {isUploading ? "Uploading..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

