"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Target, Brain, CheckCircle, User, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import UploadStep from "@/components/upload-step"
import AICheckStep from "@/components/ai-check-step"
import DetectionChoiceStep from "@/components/detection-choice-step"
import ResultsStep from "@/components/results-step"

const steps = [
  { id: "upload", title: "Upload Image", icon: Upload },
  { id: "ai-check", title: "AI Verification", icon: Brain },
  { id: "detection", title: "Detection Method", icon: Target },
  { id: "results", title: "Results", icon: CheckCircle },
]

export default function AnalysisPage() {
  const [currentStep, setCurrentStep] = useState("upload")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [aiCheckResult, setAiCheckResult] = useState<any>(null)
  const [detectionMethod, setDetectionMethod] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep)
  }

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const resetAnalysis = () => {
    setCurrentStep("upload")
    setUploadedImage(null)
    setAiCheckResult(null)
    setDetectionMethod(null)
    setAnalysisResults(null)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Analysis Dashboard</h1>
              <p className="text-gray-300">Welcome back, {user.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = getCurrentStepIndex() > index
            const StepIcon = step.icon

            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    opacity: isActive || isCompleted ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isCompleted
                      ? "bg-green-500 border-green-500"
                      : isActive
                        ? "bg-cyan-500 border-cyan-500"
                        : "bg-white/10 border-white/20"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <StepIcon className="w-6 h-6 text-white" />
                  )}
                </motion.div>

                <div className="ml-3">
                  <p className={`text-sm font-medium ${isActive || isCompleted ? "text-white" : "text-gray-400"}`}>
                    {step.title}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${isCompleted ? "bg-green-500" : "bg-white/20"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === "upload" && (
              <UploadStep uploadedImage={uploadedImage} setUploadedImage={setUploadedImage} onNext={goToNextStep} />
            )}

            {currentStep === "ai-check" && (
              <AICheckStep
                uploadedImage={uploadedImage}
                aiCheckResult={aiCheckResult}
                setAiCheckResult={setAiCheckResult}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}

            {currentStep === "detection" && (
              <DetectionChoiceStep
                detectionMethod={detectionMethod}
                setDetectionMethod={setDetectionMethod}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}

            {currentStep === "results" && (
              <ResultsStep
                uploadedImage={uploadedImage}
                detectionMethod={detectionMethod}
                analysisResults={analysisResults}
                setAnalysisResults={setAnalysisResults}
                onReset={resetAnalysis}
                onBack={goToPreviousStep}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
