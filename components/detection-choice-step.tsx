"use client"

import { motion } from "framer-motion"
import { Target, Zap, Brain, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DetectionChoiceStepProps {
  detectionMethod: string | null
  setDetectionMethod: (method: string) => void
  onNext: () => void
  onBack: () => void
}

export default function DetectionChoiceStep({
  detectionMethod,
  setDetectionMethod,
  onNext,
  onBack,
}: DetectionChoiceStepProps) {
  const handleMethodSelect = (method: string) => {
    setDetectionMethod(method)
    setTimeout(() => {
      onNext()
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Choose Detection Method</h2>
        <p className="text-gray-300 text-lg">Select your preferred damage detection algorithm</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer"
          onClick={() => handleMethodSelect("yolo")}
        >
          <Card
            className={`bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 h-full ${
              detectionMethod === "yolo" ? "ring-2 ring-cyan-400" : ""
            }`}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">YOLO Detection</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Fast and efficient object detection using YOLO (You Only Look Once) algorithm. Perfect for quick
                analysis and real-time processing.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Speed</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Accuracy</span>
                  <div className="flex space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-cyan-400 rounded-full" />
                    ))}
                    <div className="w-2 h-2 bg-gray-600 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="bg-cyan-500/20 rounded-lg p-3 mb-4">
                <p className="text-cyan-300 text-sm font-medium">⚡ Recommended for speed-focused detection</p>
              </div>

              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                Choose YOLO
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer"
          onClick={() => handleMethodSelect("roboflow")}
        >
          <Card
            className={`bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 h-full ${
              detectionMethod === "roboflow" ? "ring-2 ring-purple-400" : ""
            }`}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">Roboflow Detection</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Advanced computer vision with precise segmentation using Roboflow technology. Ideal for detailed
                analysis and high-precision requirements.
              </p>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Speed</span>
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-purple-400 rounded-full" />
                    ))}
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-gray-600 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Accuracy</span>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-purple-400 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/20 rounded-lg p-3 mb-4">
                <p className="text-purple-300 text-sm font-medium">🎯 Recommended for precision-focused detection</p>
              </div>

              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Choose Roboflow
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onBack}
          className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Verification
        </Button>
      </div>
    </div>
  )
}
