"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { ImageUploadModal } from "./ImageUploadModal"

export function ImageUploadButton({ onPostUploaded }: { onPostUploaded: () => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Upload Post</button>
      <ImageUploadModal isOpen={isOpen} onClose={() => setIsOpen(false)} onPostUploaded={onPostUploaded} />
    </>
  )
}