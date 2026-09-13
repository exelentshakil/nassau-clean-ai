import { NextRequest, NextResponse } from "next/server";
import { calculateCleaningPrice } from "@/lib/pricing-engine";
import { DEFAULT_PRICING_RULES } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { message, previousMessages = [] } = await req.json();
    const openAiKey = process.env.OPENAI_API_KEY;
    const lower = (message || "").toLowerCase();

    // 1. Live OpenAI Assistant (if configured)
    if (openAiKey) {
      try {
        const systemPrompt = `You are the AI Booking Assistant for NassauClean, a premium residential cleaning service in Nassau County, NY (serving Massapequa, Garden City, Syosset, Merrick, and surrounding Long Island towns).
You must answer questions strictly based on the company's verified rules, pricing formulas, and policies. Do NOT make up prices or policies.

Company Rules & Pricing:
- Base service: $120
- Bedrooms: +$25 each
- Bathrooms: +$35 each
- Square footage: Up to 1500 sqft ($0), 1500-2500 sqft (+$30), 2500-3500 sqft (+$65), 3500+ sqft (+$105)
- Cleaning types: Standard (1.0x), Deep Clean (1.45x - includes hand-scrubbed baseboards, exterior vents, detailed grout scrub), Move-in/Move-out (1.65x - includes inside closets, heavy vacuuming, empty home prep), Post-Construction (1.90x)
- Condition modifier: Normal (1.0x), Heavy Buildup (+25% and +1.5 hrs), Extreme Neglect (+50% and +3.0 hrs)
- Add-ons: Deep Oven ($45), Inside Fridge ($40), Interior Windows up to 10 panes ($55), Inside Cabinets ($50), Baseboards ($45), Pet Hair Removal ($35)
- Discounts: Weekly (20% off), Bi-Weekly (15% off), Monthly (10% off), One-Time (No discount)
- Payment: 25% deposit online via Stripe, balance due on completion.
- Availability: Monday-Saturday 8:00 AM - 6:00 PM. Two dedicated teams (South Shore Crew and North Shore/Central Crew). Closed Sundays.
- Cancellation: Free reschedule or cancel with at least 24 hours notice.

Be friendly, concise, and helpful. Always give the exact calculated dollar amount for the home specs requested.`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              ...previousMessages.map((m: any) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.text,
              })),
              { role: "user", content: message },
            ],
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices[0]?.message?.content;

          // Check if we can attach a 1-click wizard configuration
          let suggestedAction = undefined;
          if (lower.includes("3-bed") || lower.includes("3 bed") || lower.includes("three bed")) {
            const isDeep = lower.includes("deep");
            const hasOven = lower.includes("oven");
            const hasFridge = lower.includes("fridge");
            const addOns: string[] = [];
            if (hasOven) addOns.push("oven");
            if (hasFridge) addOns.push("fridge");

            const quote = calculateCleaningPrice({
              bedrooms: 3,
              bathrooms: 2,
              squareFeet: 2000,
              cleaningType: isDeep ? "deep" : "standard",
              homeCondition: "normal",
              addOnIds: addOns,
              frequency: "one_time",
            });

            suggestedAction = {
              type: "APPLY_CONFIG_TO_WIZARD" as const,
              bedrooms: 3,
              bathrooms: 2,
              sqft: 2000,
              cleaningType: isDeep ? ("deep" as const) : ("standard" as const),
              condition: "normal" as const,
              addOns,
              frequency: "one_time" as const,
              calculatedPrice: quote.finalTotal,
            };
          }

          return NextResponse.json({
            reply: aiResponse,
            suggestedAction,
          });
        }
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to deterministic AI engine:", err);
      }
    }

    // 2. Deterministic Grounded Knowledge Engine (Fallback & Instant response)
    let reply = "";
    let suggestedAction = undefined;

    if (lower.includes("how much") || lower.includes("price") || lower.includes("quote") || lower.includes("cost")) {
      const is3Bed = lower.includes("3") || lower.includes("three");
      const is4Bed = lower.includes("4") || lower.includes("four");
      const isDeep = lower.includes("deep");
      const beds = is4Bed ? 4 : 3;
      const baths = is4Bed ? 2.5 : 2;
      const sqft = is4Bed ? 2600 : 2000;
      const type = isDeep ? "deep" : "standard";

      const quote = calculateCleaningPrice({
        bedrooms: beds,
        bathrooms: baths,
        squareFeet: sqft,
        cleaningType: type,
        homeCondition: "normal",
        addOnIds: [],
        frequency: "one_time",
      });

      reply = `For a ${beds}-bedroom, ${baths}-bathroom home (approx. ${sqft} sq ft) in Nassau County, a ${type.toUpperCase()} cleaning is exactly $${quote.finalTotal.toFixed(2)} (or $${(quote.finalTotal * 0.85).toFixed(2)} with our popular 15% Bi-Weekly discount). This includes a complete room-by-room sanitize, kitchen scrub, and floors. Would you like me to pre-fill your booking form with these specs?`;

      suggestedAction = {
        type: "APPLY_CONFIG_TO_WIZARD" as const,
        bedrooms: beds,
        bathrooms: baths,
        sqft,
        cleaningType: type,
        condition: "normal" as const,
        addOns: [],
        frequency: "one_time" as const,
        calculatedPrice: quote.finalTotal,
      };
    } else if (lower.includes("oven") || lower.includes("fridge") || lower.includes("refrigerator") || lower.includes("add-on")) {
      reply = `Yes! We offer full interior oven degreasing for $45 (+45 min) and deep refrigerator & freezer sanitization for $40 (+35 min). You can also add interior window cleaning ($55 for 10 panes) and inside cabinet wipe-downs ($50). Both can be selected during step 2 of our booking form.`;
    } else if (lower.includes("saturday") || lower.includes("weekend") || lower.includes("available") || lower.includes("schedule")) {
      reply = `Yes, we clean Monday through Saturday from 8:00 AM to 6:00 PM across Nassau County (Massapequa, Garden City, Syosset, Merrick, and more). We have 2 dedicated teams running daily morning (8:30 AM) and afternoon (1:00 PM) arrival windows. You can view real-time open slots on our calendar in Step 4.`;
    } else if (lower.includes("standard") && lower.includes("deep")) {
      reply = `Great question! Standard Cleaning covers routine maintenance: sanitizing bathrooms, kitchen counters and exterior appliances, dusting surfaces, vacuuming carpets, and mopping floors. Deep Cleaning (1.45x) adds intense hand-scrubbing of baseboards, interior doors, tile grout, exterior heating vents, light fixtures, and extra attention to built-up grease and soap scum.`;
    } else if (lower.includes("condition") || lower.includes("heavy") || lower.includes("extra time") || lower.includes("dirty")) {
      reply = `We explicitly account for homes needing extra attention! In step 1, you can select 'Heavy Buildup' (+25% price, +1.5 labor hours) or 'Extreme Dirt / Neglect' (+50% price, +3.0 labor hours). This ensures our team arrives with the right supplies and enough allotted time to finish the job thoroughly without cutting corners.`;
    } else {
      reply = `Welcome to NassauClean AI! I can provide exact instant quotes for your home, explain our cleaning checklists (Standard vs. Deep vs. Move-In), check team availability in Nassau County (Massapequa, Garden City, etc.), and help you apply add-ons like ovens and fridges. How can I help with your cleaning needs today?`;
    }

    return NextResponse.json({
      reply,
      suggestedAction,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "I'm available to help calculate pricing and answer questions about our cleaning packages in Nassau County. What home details can I price for you?",
      },
      { status: 200 }
    );
  }
}
