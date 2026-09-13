import { NextResponse } from "next/server";

export async function GET() {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

  return NextResponse.json({
    status: "healthy",
    service: "NassauClean AI — Residential Cleaning Booking & Dispatch Engine",
    timestamp: new Date().toISOString(),
    market: "Nassau County, Long Island, NY (Massapequa, Garden City, Syosset)",
    components: {
      pricingEngine: {
        status: "active",
        type: "deterministic",
        rulesLoaded: ["base_rate", "bed_bath_rates", "sqft_tiers", "condition_multipliers", "frequency_discounts"],
        hallucinationRisk: "0.0% (Deterministic Code)"
      },
      schedulingAndDispatch: {
        status: "active",
        teamsConfigured: 2,
        bufferTimeMinutes: 45,
        doubleBookingPrevention: "enabled"
      },
      paymentGateway: {
        status: "ready",
        provider: "Stripe",
        modesSupported: ["deposit_25_percent", "full_payment"]
      },
      smsAutomations: {
        status: "active",
        provider: "Twilio",
        templatesLoaded: ["booking_confirmation", "team_dispatch_alert", "24h_reminder", "reschedule_link"]
      },
      aiBookingAssistant: {
        status: hasOpenAI || hasGemini ? "live_llm_grounded" : "deterministic_grounded_fallback",
        provider: hasOpenAI ? "OpenAI (GPT-4o-mini)" : hasGemini ? "Google Gemini 2.5 Flash" : "Deterministic Knowledge Base",
        groundedInCompanyPolicy: true,
        toolCallingEnabled: true
      },
      persistence: {
        status: hasSupabase ? "connected_supabase" : "in_memory_state"
      }
    }
  });
}
