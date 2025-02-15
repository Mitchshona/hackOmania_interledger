"use client"

import type React from "react"

import { useState, useRef } from "react"
import axios from "axios"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface VerifyImageModalProps {
  isOpen: boolean
  onClose: () => void
  onPostUploaded: () => Promise<void>; 
}

export function VerifyImageModal({ isOpen, onClose, onPostUploaded }: VerifyImageModalProps) {
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
      alert("Please select an image to upload");
      return;
    }
  
    setIsUploading(true);

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser?.id || !currentUser?.avatar) {
      alert("User not found. Please sign in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("caption", caption);
    formData.append("avatar", currentUser.avatar);
  
    try {
      const response = await fetch("/api/upload-post", {
        method: "POST",
        headers: { "user-id": currentUser.id },
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log("Post uploaded successfully:", data);
        onClose();
        setSelectedFile(null);
        setCaption("");
        await onPostUploaded();
      } else {
        alert("Failed to upload post. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Failed to upload post. Please try again.");
    } finally {
      setIsUploading(false);
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
