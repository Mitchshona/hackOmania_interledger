"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation" // ✅ Extract username from URL
import Image from "next/image"
import { db } from "@/app/config/firebase-config"
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VerifyImageModalProps {
  isOpen: boolean
  onClose: () => void
  onPostUploaded: () => Promise<void>
}

export function VerifyImageModal({
  isOpen,
  onClose,
  onPostUploaded,
}: VerifyImageModalProps) {
  const { username } = useParams() // ✅ Retrieve username from URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [screenTimeMessage, setScreenTimeMessage] = useState("")
  const [streak, setStreak] = useState<number | null>(null) // ✅ Store streak in state
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ✅ Handle file change for image upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setCurrentStep(2)
    }
  }

  // ✅ Fetch streak from Firestore and update UI
  const fetchStreak = async () => {
    if (!username) {
      console.error("Username not found in URL.")
      return
    }

    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("userName", "==", username))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]
        const userRef = doc(db, "users", userDoc.id)
        const userData = (await getDoc(userRef)).data()

        if (userData) {
          setStreak(userData.streak || 0) // ✅ Update state with Firestore streak
        }
      }
    } catch (error) {
      console.error("Error fetching streak:", error)
    }
  }

  // ✅ Increase streak and refresh UI
  const increaseStreak = async () => {
    if (!username) {
      console.error("Username not found in URL.")
      return
    }

    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("userName", "==", username))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]
        const userRef = doc(db, "users", userDoc.id)

        // ✅ Fetch latest data before updating
        const latestUserDoc = await getDoc(userRef)
        const latestUserData = latestUserDoc.data()

        if (!latestUserData) {
          console.error(`User '${username}' data is missing.`)
          return
        }

        // ✅ Increase streak
        const newStreak = (latestUserData.streak || 0) + 1
        await updateDoc(userRef, { streak: newStreak })

        console.log(`🔥 Streak updated! New streak: ${newStreak}`)

        // ✅ Fetch updated streak count to refresh UI
        fetchStreak()
      }
    } catch (error) {
      console.error("Error updating streak:", error)
    }
  }

  // ✅ Auto-fetch streak when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchStreak()
    }
  }, [isOpen])

  // ✅ Handle file upload & verification
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.")
      return
    }

    setIsUploading(true)

    try {
      const reader = new FileReader()

      reader.onload = async () => {
        const base64Image = reader.result as string

        const response = await fetch("http://localhost:5600/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        })

        const data = await response.json()

        if (response.ok) {
          console.log("Analysis successful:", data)

          const screenTimeMinutes = parseInt(data.dailyScreenTime, 10) || 0
          const hours = Math.floor(screenTimeMinutes / 60)
          const minutes = screenTimeMinutes % 60

          setScreenTimeMessage(
            `Step 2: Verify that your screen time is ${hours}h ${minutes}m`
          )

          // ✅ If screen time is below 2 hours, increase streak
          if (screenTimeMinutes <= 120) {
            alert("Successful verification! Congratulations")

            // ✅ Increase streak and refresh UI
            await increaseStreak()
          } else {
            alert("Sorry, screen time exceeds 2 hours!")
          }

          // ✅ Reset state after a successful upload
          resetForm()
          onClose()
        } else {
          alert(`Failed to analyze image: ${data.descriptionOfAnalysis}`)
        }
      }

      reader.onerror = () => {
        alert("Error reading the image file. Please try again.")
      }

      reader.readAsDataURL(selectedFile)
    } catch (error) {
      console.error("Error analyzing image:", error)
      alert("Failed to analyze image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // ✅ Reset form after closing modal
  const resetForm = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setCurrentStep(1)
    setScreenTimeMessage("")
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Your Screen Time</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {currentStep === 1 && (
            <Alert>
              <AlertDescription>
                Step 1: Upload a clear photo of your daily screen time image.
              </AlertDescription>
            </Alert>
          )}
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
                src={previewUrl}
                alt="Selected image preview"
                width={300}
                height={300}
                className="rounded-md object-cover"
              />
            </div>
          )}
          {currentStep === 2 && (
            <Alert>
              <AlertDescription>
                {screenTimeMessage || "Step 2: Verify that your image clearly shows your daily screen time."}
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => { onClose(); resetForm(); }} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !selectedFile || currentStep !== 2}>
            {isUploading ? "Uploading..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
