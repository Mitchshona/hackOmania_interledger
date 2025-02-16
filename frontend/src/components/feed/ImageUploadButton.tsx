"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { ImageUploadModal } from "./ImageUploadModal"

export function ImageUploadButton({ onPostUploaded }: { onPostUploaded: () => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button className="bg-blue-600 hover:bg-blue-800 text-white" onClick={() => setIsOpen(true)}>Upload Post</Button>
      <ImageUploadModal isOpen={isOpen} onClose={() => setIsOpen(false)} onPostUploaded={onPostUploaded} />
    </>

  )
}