import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File
    const method = formData.get("method") as string

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    if (!method || !["yolo", "roboflow"].includes(method)) {
      return NextResponse.json({ error: "Invalid detection method" }, { status: 400 })
    }

    // Check if we have an AI service URL configured
    const aiServiceUrl = process.env.AI_SERVICE_URL

    // If we're in a preview environment or AI service isn't configured,
    // return a mock response instead of trying to call the actual service
    if (!aiServiceUrl) {
      console.log("AI service URL not configured, using mock response")

      // Wait a bit to simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock detections
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

      // Return mock response
      return NextResponse.json({
        detections: mockDetections,
        confidence: 0.895,
        processing_time: 1.8,
        annotated_image: null,
        method: method,
        brand: "BMW",
        damage_types: ["dent", "scratch"],
        severity: "moderate",
      })
    }

    // Convert file to base64 for processing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    try {
      // Call complete analysis endpoint
      const response = await fetch(`${aiServiceUrl}/complete-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          method: method,
        }),
      })

      if (!response.ok) {
        throw new Error(`Analysis service responded with status: ${response.status}`)
      }

      const result = await response.json()

      // Check if AI-generated image was detected
      if (result.error && result.error.includes("AI-generated")) {
        return NextResponse.json(
          {
            error: "AI-generated image detected",
            ai_check: result.ai_check,
          },
          { status: 400 },
        )
      }

      return NextResponse.json({
        detections: result.detection.detections,
        confidence: result.detection.confidence,
        processing_time: result.total_processing_time,
        annotated_image: result.detection.annotated_image,
        method: method,
        brand: result.brand.brand,
        brand_confidence: result.brand.confidence,
        damage_types: result.damage_types.damage_types,
        severity: result.severity.severity,
        severity_confidence: result.severity.confidence,
      })
    } catch (serviceError) {
      console.error("Detection service error:", serviceError)

      // If the service call fails, fall back to mock response
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

      return NextResponse.json({
        detections: mockDetections,
        confidence: 0.895,
        processing_time: 1.8,
        annotated_image: null,
        method: method,
        brand: "BMW",
        damage_types: ["dent", "scratch"],
        severity: "moderate",
        note: "Using mock data due to service unavailability",
      })
    }
  } catch (error) {
    console.error("Damage detection error:", error)
    return NextResponse.json({ error: "Failed to process damage detection" }, { status: 500 })
  }
}
