"use client";

import type React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VerifyImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostUploaded: () => Promise<void>;
}

export function VerifyImageModal({
  isOpen,
  onClose,
  onPostUploaded,
}: VerifyImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [screenTimeMessage, setScreenTimeMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCurrentStep(2);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }
  
    setIsUploading(true);
  
    try {
      const reader = new FileReader();
  
      reader.onload = async () => {
        const base64Image = reader.result as string;
  
        console.log(base64Image);
  
        const response = await fetch("http://localhost:5600/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          console.log("Analysis successful:", data);
  
          const screenTimeMinutes = parseInt(data.dailyScreenTime, 10) || 0;
          const hours = Math.floor(screenTimeMinutes / 60);
          const minutes = screenTimeMinutes % 60;
  
          setScreenTimeMessage(
            `Step 2: Verify that your screen time is ${hours}h ${minutes}m`
          );
  
          // Check if screen time is below 2 hours
          if (screenTimeMinutes <= 120) {
            alert("Successful verification! Congratulations");
          } else {
            alert("Sorry, screen time exceeds 2 hours!");
          }
  
          // Reset the state after a successful upload
          resetForm();
          onClose();
          await onPostUploaded();
        } else {
          alert(`Failed to analyze image: ${data.descriptionOfAnalysis}`);
        }
      };
  
      reader.onerror = () => {
        alert("Error reading the image file. Please try again.");
      };
  
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setSelectedFile(null);      // Clear the selected file
    setPreviewUrl(null);        // Clear the preview URL
    setCurrentStep(1);          // Reset to Step 1
    setScreenTimeMessage("");  // Clear any messages related to screen time
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input field
    }
  };
  

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        resetForm();
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
          <Button
            onClick={() => {
              onClose();
              resetForm();
            }}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || currentStep !== 2}
          >
            {isUploading ? "Uploading..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
