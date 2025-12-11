"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Car, AlertTriangle, DollarSign, ArrowLeft, RotateCcw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import GarageCarousel from "@/components/garage-carousel"

interface ResultsStepProps {
  uploadedImage: File | null
  detectionMethod: string | null
  analysisResults: any
  setAnalysisResults: (results: any) => void
  onReset: () => void
  onBack: () => void
}

export default function ResultsStep({
  uploadedImage,
  detectionMethod,
  analysisResults,
  setAnalysisResults,
  onReset,
  onBack,
}: ResultsStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!analysisResults && uploadedImage && detectionMethod) {
      runAnalysis()
    }
  }, [uploadedImage, detectionMethod, analysisResults])

  const runAnalysis = async () => {
    if (!uploadedImage || !detectionMethod) return

    setIsAnalyzing(true)
    setError(null)

    try {
      // Step 1: Run damage detection
      const formData = new FormData()
      formData.append("image", uploadedImage)
      formData.append("method", detectionMethod)

      const detectionResponse = await fetch("/api/damage-detection", {
        method: "POST",
        body: formData,
      })

      if (!detectionResponse.ok) {
        const errorText = await detectionResponse.text()
        throw new Error(`Damage detection failed: ${errorText}`)
      }

      const detectionResult = await detectionResponse.json()

      // Generate mock cost estimation if we don't have a real API
      let costResult
      try {
        // Step 2: Estimate costs based on detections
        const costResponse = await fetch("/api/cost-estimation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            detections: detectionResult.detections,
            brand: extractBrandFromDetections(detectionResult.detections) || "Unknown",
          }),
        })

        if (!costResponse.ok) {
          throw new Error("Cost estimation failed")
        }

        costResult = await costResponse.json()
      } catch (costError) {
        console.error("Cost estimation error:", costError)

        // Fallback to mock cost data
        const brand = extractBrandFromDetections(detectionResult.detections) || "BMW"
        const totalCost = Math.round(1500 + Math.random() * 1000)

        costResult = {
          total_cost: totalCost,
          parts_cost: Math.round(totalCost * 0.7),
          labor_cost: Math.round(totalCost * 0.3),
          brand: brand,
          breakdown: detectionResult.detections.map((d: any) => ({
            damage_type: d.class,
            severity: d.confidence > 0.8 ? "severe" : d.confidence > 0.6 ? "moderate" : "minor",
            confidence: d.confidence,
            cost: Math.round(300 + Math.random() * 500),
            location: d.bbox,
          })),
          currency: "DT",
          note: "Using mock cost data",
        }
      }

      // Combine results
      const finalResults = {
        detections: detectionResult.detections,
        annotatedImage: detectionResult.annotated_image,
        confidence: detectionResult.confidence,
        method: detectionMethod,
        brand: costResult.brand,
        totalCost: costResult.total_cost,
        partsCost: costResult.parts_cost,
        laborCost: costResult.labor_cost,
        breakdown: costResult.breakdown,
        processingTime: detectionResult.processing_time,
        note: detectionResult.note || costResult.note,
      }

      setAnalysisResults(finalResults)
    } catch (error) {
      console.error("Analysis failed:", error)
      setError("Analysis failed. Using mock data instead.")

      // Provide mock results as fallback
      const mockDetections = [
        {
          class: "dent",
          confidence: 0.92,
          bbox: [120, 80, 200, 150],
        },
        {
          class: "scratch",
          confidence: 0.87,
          bbox: [300, 200, 450, 280],
        },
      ]

      const brand = "BMW"
      const totalCost = 2250

      setAnalysisResults({
        detections: mockDetections,
        annotatedImage: null,
        confidence: 0.895,
        method: detectionMethod,
        brand: brand,
        totalCost: totalCost,
        partsCost: Math.round(totalCost * 0.7),
        laborCost: Math.round(totalCost * 0.3),
        breakdown: mockDetections.map((d) => ({
          damage_type: d.class,
          severity: d.confidence > 0.8 ? "severe" : "moderate",
          confidence: d.confidence,
          cost: d.class === "dent" ? 1350 : 900,
          location: d.bbox,
        })),
        processingTime: 1.8,
        note: "Using mock data due to service unavailability",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const extractBrandFromDetections = (detections: any[]) => {
    // Look for brand-specific detections or use image classification
    const brands = ["BMW", "Mercedes", "Audi", "Toyota", "Honda", "Volkswagen", "Ford", "Peugeot", "Renault", "Hyundai"]

    if (!detections || !Array.isArray(detections)) {
      return "BMW" // Default brand
    }

    for (const detection of detections) {
      for (const brand of brands) {
        if (detection.class && detection.class.toLowerCase().includes(brand.toLowerCase())) {
          return brand
        }
      }
    }

    return "BMW" // Default to BMW if no brand detected
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="bg-red-500/20 border-red-500/30">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-red-400 mb-4">Analysis Warning</h3>
            <p className="text-gray-300 mb-6">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Analyzing Your Vehicle</h2>
          <p className="text-gray-300 text-lg mb-8">
            Running {detectionMethod?.toUpperCase()} detection and cost estimation using your trained models
          </p>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"
              />
              <div className="space-y-3">
                <motion.p
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  className="text-white font-medium"
                >
                  {detectionMethod === "yolo"
                    ? "Running YOLO detection (best.pt)..."
                    : "Running damage classification (car-damage-model.h5)..."}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  className="text-gray-300"
                >
                  Identifying damaged components...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                  className="text-gray-300"
                >
                  Calculating repair costs...
                </motion.p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!analysisResults) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Analysis Complete</h2>
        <p className="text-gray-300 text-lg">
          {analysisResults.method?.toUpperCase()} detection completed in{" "}
          {analysisResults.processingTime?.toFixed(2) || "1.8"}s
        </p>
        {analysisResults.note && <p className="text-yellow-300 text-sm mt-2">{analysisResults.note}</p>}
      </motion.div>

      {/* Detection Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                {analysisResults.method?.toUpperCase()} Detection Results
              </h3>
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                {analysisResults.annotatedImage ? (
                  <img
                    src={`data:image/jpeg;base64,${analysisResults.annotatedImage}`}
                    alt="Detection results"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(uploadedImage!) || "/placeholder.svg"}
                    alt="Original image"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-gray-300 text-center">
                Detected {analysisResults.detections?.length || 0} damaged components with{" "}
                {((analysisResults.confidence || 0.9) * 100).toFixed(1)}% average confidence
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Detected Damages</h3>

              <div className="space-y-3 mb-6">
                {analysisResults.breakdown?.map((item: any, index: number) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{item.damage_type}</p>
                        <p className="text-gray-400 text-sm">
                          {item.severity} severity • {((item.confidence || 0.9) * 100).toFixed(1)}% confidence
                        </p>
                      </div>
                      <p className="text-cyan-400 font-bold">{item.cost} DT</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-cyan-500/20 rounded-lg p-4 text-center">
                <Car className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-cyan-300 font-semibold">Vehicle Brand</p>
                <p className="text-white text-xl font-bold">{analysisResults.brand}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cost Estimation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <DollarSign className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-white mb-1">Parts Cost</h4>
                <p className="text-2xl font-bold text-yellow-400">{analysisResults.partsCost} DT</p>
              </div>
              <div>
                <DollarSign className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-white mb-1">Labor Cost</h4>
                <p className="text-2xl font-bold text-orange-400">{analysisResults.laborCost} DT</p>
              </div>
              <div>
                <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <h4 className="text-lg font-semibold text-white mb-1">Total Estimate</h4>
                <p className="text-3xl font-bold text-green-400">{analysisResults.totalCost} DT</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-wrap gap-4 justify-center mb-12"
      >
        <Button
          onClick={onReset}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Analysis
        </Button>

        <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>

        <Button
          onClick={onBack}
          className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Detection
        </Button>
      </motion.div>

      {/* Garage Recommendations */}
      <GarageCarousel />
    </div>
  )
}
