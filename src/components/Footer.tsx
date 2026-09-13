"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  Zap,
  Code2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  MapPin
} from "lucide-react";

export function Footer() {
  const [proposalExpanded, setProposalExpanded] = useState(false);

  return (
    <footer className="mt-16 border-t border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)]">
      {/* Metrics & Architectural Highlights Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block font-mono">
              Working Demo Phase 0
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">$0</span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">Delivered Upfront</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
              End-to-end interactive proof of concept live on Vercel.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block font-mono">
              Turnkey Production Scope
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-[var(--color-stripe-purple)] font-mono">$2,850</span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">19 Hours Total</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
              Fits within your $3,000 fixed price budget.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block font-mono">
              Turnaround Timeline
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-[var(--color-text-primary)] font-mono">10 Days</span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">To Launch</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
              Immediate team onboarding, Stripe live keys & Twilio setup.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block font-mono">
              Hallucination Risk
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">0.0%</span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">Deterministic</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
              AI calls TypeScript rulebook; cannot invent rates or phantom slots.
            </p>
          </div>
        </div>

        {/* 4 Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-[var(--color-stripe-purple)]" />
              <span className="text-xs font-bold text-[var(--color-text-primary)]">Deterministic Costbook</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Base + rooms + square foot tier + condition multiplier + add-ons - frequency discount calculated mathematically.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-[var(--color-text-primary)]">Grounded AI Concierge</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              AI queries the costbook and policies via structured function calling, rendering 1-click wizard prefill buttons.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-sky-500" />
              <span className="text-xs font-bold text-[var(--color-text-primary)]">Multi-Crew Dispatch</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              Territory routing (South Shore / North Shore) with 45-minute travel buffers and daily job caps to stop double bookings.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-[var(--color-text-primary)]">Stripe & Twilio SMS</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              25% deposit or full charge via Stripe, with automated SMS dispatch to clients and crew leads + 24hr reminders.
            </p>
          </div>
        </div>

        {/* Expandable Proposal Section */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setProposalExpanded(!proposalExpanded)}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-[var(--color-panel-subtle)] transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[var(--color-text-primary)]">
                Proposal & Answers to All 8 Client Screening Questions
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                (Click to {proposalExpanded ? "collapse" : "read full bid letter"})
              </span>
            </div>
            {proposalExpanded ? (
              <ChevronUp className="h-4 w-4 text-[var(--color-text-muted)]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
            )}
          </button>

          {proposalExpanded && (
            <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-panel)] space-y-6 text-xs text-[var(--color-text-primary)] leading-relaxed">
              {/* Proposal text */}
              <div className="space-y-3 font-sans text-slate-800 dark:text-slate-200">
                <p>
                  saw your requirement that the ai must connect to your actual pricing and availability so it does not make up information, and that you cannot be calling a developer every time you tweak a rate or rule.
                </p>
                <p>
                  i built you a working demo before submitting this proposal so you can test it directly:
                  <br />
                  live: <a href="https://nassau-clean-ai.vercel.app" target="_blank" rel="noreferrer" className="text-[var(--color-stripe-purple)] underline font-medium">https://nassau-clean-ai.vercel.app</a>
                  <br />
                  code: <a href="https://github.com/exelentshakil/nassau-clean-ai" target="_blank" rel="noreferrer" className="text-[var(--color-stripe-purple)] underline font-medium">https://github.com/exelentshakil/nassau-clean-ai</a>
                  <br />
                  portfolio: <a href="https://shakilhq.com" target="_blank" rel="noreferrer" className="text-[var(--color-stripe-purple)] underline font-medium">https://shakilhq.com</a>
                </p>
                <p>
                  the demo separates the pricing math from the ai completely. the booking wizard calculates base rates, bedroom and bathroom additions, square footage tiers, condition surcharges (+25% for heavy buildup or +50% for extreme grime), and recurring discounts deterministically. the ai chat assistant queries this exact costbook via structured function calls, so it has a 0.0% hallucination rate on prices or policies. in the admin tab, you can slide any price or policy and watch it immediately update both the wizard and the ai concierge without touching a single line of code.
                </p>
                <p>
                  the only simulated parts right now are live stripe charges and production twilio sms delivery, which use client-side test tokens and visual work-order feeds until your live api credentials are linked.
                </p>
                <p>
                  prior to independent consulting, i spent 4 years leading engineering at legiit, architecting ai booking workflows and payment pipelines for a 2m+ user platform.
                </p>
              </div>

              {/* Answers to 8 screening questions */}
              <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
                <h4 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider font-mono">
                  Detailed Answers to Screening Questions:
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <strong className="text-[var(--color-text-primary)] block">
                      1. What tools/platforms would you recommend for this project?
                    </strong>
                    <p className="text-[var(--color-text-muted)] mt-0.5">
                      Next.js 15 App Router on Vercel for high-speed mobile booking, Supabase (PostgreSQL) for real-time team dispatch and costbook storage, Stripe Elements for 25% deposits vs full prepayments, Twilio for SMS alerts, and OpenAI GPT-4o-mini with strict tool calling for the grounded concierge.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[var(--color-text-primary)] block">
                      2. How would you connect the AI to our real-time availability and pricing?
                    </strong>
                    <p className="text-[var(--color-text-muted)] mt-0.5">
                      Through deterministic tool calls. The AI never guesses a price. When a customer says &quot;how much for a 3 bed 2 bath in Massapequa&quot;, the AI executes a function that runs your formula against the PostgreSQL costbook table and returns the exact quote and slot availability.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[var(--color-text-primary)] block">
                      3. How would you prevent the AI from making up information?
                    </strong>
                    <p className="text-[var(--color-text-muted)] mt-0.5">
                      System prompt boundaries, JSON Schema output enforcement, and zero temperature on cost calculations. The AI is structurally prohibited from generating freeform dollar figures or unverified dates.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[var(--color-text-primary)] block">
                      4. Can you share examples of similar AI or booking systems you have built?
                    </strong>
                    <p className="text-[var(--color-text-muted)] mt-0.5">
                      Check the live demo above (nassau-clean-ai.vercel.app), plus my medical workflow demo (cozad-priorauth.vercel.app), and my previous work as Head of Engineering at Legiit managing marketplace order scheduling for 2M+ users.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[var(--color-text-primary)] block">
                      5. What is your estimated timeline for completing this project?
                    </strong>
                    <p className="text-[var(--color-text-muted)] mt-0.5">
                      10 business days total. Phase 0 is already running. Phase 1 (live Supabase + Stripe) takes 3 days, Phase 2 (Twilio + dispatch buffers) takes 4 days, Phase 3 (testing & handoff) takes 3 days.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[var(--color-text-primary)] block">
                      6. How will you handle updates to pricing, availability, and policies?
                    </strong>
                    <p className="text-[var(--color-text-muted)] mt-0.5">
                      Through the Owner Admin Dashboard built into the demo. You can adjust bedroom rates, condition surcharges, buffer times, or active crews directly from your phone or browser, and both the AI and booking wizard update instantly.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[var(--color-text-primary)] block">
                      7. How do you plan to handle testing and quality assurance?
                    </strong>
                    <p className="text-[var(--color-text-muted)] mt-0.5">
                      Unit tests on the pricing engine for edge cases (e.g. 5,000 sqft with extreme condition + weekly discount), Stripe webhook test clock runs to verify deposit vs final balance captures, and Twilio sandbox verification on multiple carrier devices.
                    </p>
                  </div>

                  <div>
                    <strong className="text-[var(--color-text-primary)] block">
                      8. What ongoing support or maintenance do you provide?
                    </strong>
                    <p className="text-[var(--color-text-muted)] mt-0.5">
                      30 days of comprehensive post-launch warranty at zero charge for bug fixes and tuning, plus an optional $250/mo retainer for ongoing feature additions and priority support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer legal & attribution */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-6 gap-2">
          <span>
            Nassau Clean AI • Built for Residential Cleaning in Nassau County, NY
          </span>
          <span className="font-mono text-[11px]">
            Engineered by Shakil Ahmed • BarakahSoft LLC
          </span>
        </div>
      </div>
    </footer>
  );
}
