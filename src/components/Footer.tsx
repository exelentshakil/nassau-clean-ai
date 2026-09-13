"use client";

import React from "react";
import {
  Cpu,
  ShieldCheck,
  Zap,
  MapPin
} from "lucide-react";

export function Footer() {
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
