"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { ImageUploadModal } from "./ImageUploadModal"

export function ImageUploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <Button variant="outline" size="icon" onClick={openModal}>
        <Upload className="h-4 w-4" />
      </Button>
      <ImageUploadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}

