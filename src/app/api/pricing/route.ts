import { NextRequest, NextResponse } from "next/server";
import { calculateCleaningPrice } from "@/lib/pricing-engine";
import { DEFAULT_PRICING_RULES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bedrooms = 3,
      bathrooms = 2,
      squareFeet = 2000,
      cleaningType = "standard",
      homeCondition = "normal",
      addOnIds = [],
      frequency = "one_time",
      customRules,
    } = body;

    const breakdown = calculateCleaningPrice(
      {
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        squareFeet: Number(squareFeet),
        cleaningType,
        homeCondition,
        addOnIds,
        frequency,
      },
      customRules || DEFAULT_PRICING_RULES
    );

    return NextResponse.json({
      success: true,
      breakdown,
    });
  } catch (error) {
    console.error("Pricing calculation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate pricing" },
      { status: 400 }
    );
  }
}
