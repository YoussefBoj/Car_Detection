import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Check if we have an AI service URL configured
    const aiServiceUrl = process.env.AI_SERVICE_URL

    // If we're in a preview environment or AI service isn't configured,
    // return a mock response instead of trying to call the actual service
    if (!aiServiceUrl) {
      console.log("AI service URL not configured, using mock response")

      // Wait a bit to simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Return mock response
      return NextResponse.json({
        isAI: Math.random() > 0.8, // 20% chance of being flagged as AI
        confidence: Math.random() * 0.2 + 0.8, // 80-100% confidence
        processing_time: 1.2,
      })
    }

    // Convert file to base64 for processing
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    try {
      // Call Python AI detection service
      const response = await fetch(`${aiServiceUrl}/ai-check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          model_path: "models/gnet.h5",
        }),
      })

      if (!response.ok) {
        throw new Error(`AI service responded with status: ${response.status}`)
      }

      const result = await response.json()

      return NextResponse.json({
        isAI: result.is_ai_generated,
        confidence: result.confidence,
        processing_time: result.processing_time,
      })
    } catch (serviceError) {
      console.error("AI service error:", serviceError)

      // If the service call fails, fall back to mock response
      return NextResponse.json({
        isAI: Math.random() > 0.8,
        confidence: Math.random() * 0.2 + 0.8,
        processing_time: 1.2,
        note: "Using mock data due to service unavailability",
      })
    }
  } catch (error) {
    console.error("AI check error:", error)
    return NextResponse.json({ error: "Failed to process AI detection" }, { status: 500 })
  }
}
