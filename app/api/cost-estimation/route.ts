import { type NextRequest, NextResponse } from "next/server"

// Cost estimation based on damage type and vehicle brand
const COST_DATABASE = {
  brands: {
    BMW: { multiplier: 1.8, base_cost: 500 },
    Mercedes: { multiplier: 1.9, base_cost: 550 },
    Audi: { multiplier: 1.7, base_cost: 480 },
    Toyota: { multiplier: 1.2, base_cost: 300 },
    Honda: { multiplier: 1.1, base_cost: 280 },
    Volkswagen: { multiplier: 1.4, base_cost: 350 },
    Ford: { multiplier: 1.3, base_cost: 320 },
    Peugeot: { multiplier: 1.2, base_cost: 290 },
    Renault: { multiplier: 1.1, base_cost: 270 },
    Hyundai: { multiplier: 1.0, base_cost: 250 },
    Unknown: { multiplier: 1.2, base_cost: 300 },
  },
  damage_types: {
    dent: { cost: 400, severity_multiplier: { minor: 0.5, moderate: 1.0, severe: 1.8 } },
    scratch: { cost: 200, severity_multiplier: { minor: 0.3, moderate: 0.8, severe: 1.5 } },
    crack: { cost: 600, severity_multiplier: { minor: 0.6, moderate: 1.2, severe: 2.0 } },
    broken_light: { cost: 350, severity_multiplier: { minor: 0.8, moderate: 1.0, severe: 1.3 } },
    bumper_damage: { cost: 800, severity_multiplier: { minor: 0.7, moderate: 1.0, severe: 1.6 } },
    door_damage: { cost: 1200, severity_multiplier: { minor: 0.6, moderate: 1.0, severe: 1.8 } },
    windshield_damage: { cost: 500, severity_multiplier: { minor: 0.8, moderate: 1.0, severe: 1.4 } },
  },
}

export async function POST(request: NextRequest) {
  try {
    const { detections, brand } = await request.json()

    if (!detections || !Array.isArray(detections)) {
      return NextResponse.json({ error: "Invalid detections data" }, { status: 400 })
    }

    let totalCost = 0
    const brandInfo = COST_DATABASE.brands[brand] || COST_DATABASE.brands["Unknown"]

    // Calculate cost for each detected damage
    const costBreakdown = detections.map((detection: any) => {
      const damageType = detection.class.toLowerCase().replace(" ", "_")
      const severity = detection.confidence > 0.8 ? "severe" : detection.confidence > 0.6 ? "moderate" : "minor"

      const damageInfo = COST_DATABASE.damage_types[damageType] || COST_DATABASE.damage_types["dent"]

      const baseCost = damageInfo.cost
      const severityMultiplier = damageInfo.severity_multiplier[severity]
      const brandMultiplier = brandInfo.multiplier

      const itemCost = Math.round(baseCost * severityMultiplier * brandMultiplier + brandInfo.base_cost)

      totalCost += itemCost

      return {
        damage_type: detection.class,
        severity: severity,
        confidence: detection.confidence,
        cost: itemCost,
        location: detection.bbox,
      }
    })

    // Add labor costs (30% of parts cost)
    const laborCost = Math.round(totalCost * 0.3)
    const finalCost = totalCost + laborCost

    return NextResponse.json({
      total_cost: finalCost,
      parts_cost: totalCost,
      labor_cost: laborCost,
      brand: brand,
      breakdown: costBreakdown,
      currency: "DT",
    })
  } catch (error) {
    console.error("Cost estimation error:", error)
    return NextResponse.json({ error: "Failed to calculate cost estimation" }, { status: 500 })
  }
}
