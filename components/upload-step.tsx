"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Upload, ImageIcon, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface UploadStepProps {
  uploadedImage: File | null
  setUploadedImage: (file: File | null) => void
  onNext: () => void
}

export default function UploadStep({ uploadedImage, setUploadedImage, onNext }: UploadStepProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type.startsWith("image/")) {
          setUploadedImage(file)
        }
      }
    },
    [setUploadedImage],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0])
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Upload Your Car Image</h2>
        <p className="text-gray-300 text-lg">Please upload a clear image of your vehicle for analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-cyan-400 bg-cyan-400/10"
                    : uploadedImage
                      ? "border-green-400 bg-green-400/10"
                      : "border-white/30 hover:border-white/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {uploadedImage ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{uploadedImage.name}</p>
                      <p className="text-gray-300 text-sm">{(uploadedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      onClick={removeImage}
                      variant="outline"
                      size="sm"
                      className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-2">Drag and drop your image here, or click to browse</p>
                      <p className="text-gray-400 text-sm">Supports JPG, PNG, JPEG, WEBP (Max 10MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  <Button
                    onClick={onNext}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  >
                    Start AI Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {uploadedImage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">Image Preview</h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(uploadedImage) || "/placeholder.svg"}
                    alt="Uploaded vehicle"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
