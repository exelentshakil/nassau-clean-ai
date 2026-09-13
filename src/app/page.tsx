"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BookingWizard } from "@/components/BookingWizard";
import { AiAssistant } from "@/components/AiAssistant";
import { AdminDashboard } from "@/components/AdminDashboard";
import { SmsAuditViewer } from "@/components/SmsAuditViewer";
import { Footer } from "@/components/Footer";
import {
  BookingRecord,
  CleaningFrequency,
  CleaningType,
  HomeCondition,
  PricingRulesConfig,
} from "@/lib/types";
import { DEFAULT_PRICING_RULES, SAMPLE_INITIAL_BOOKINGS } from "@/lib/constants";
import { MapPin } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"booking" | "assistant" | "admin" | "sms">("booking");
  const [pricingRules, setPricingRules] = useState<PricingRulesConfig>(DEFAULT_PRICING_RULES);
  const [bookings, setBookings] = useState<BookingRecord[]>(SAMPLE_INITIAL_BOOKINGS);
  const [selectedBookingForSms, setSelectedBookingForSms] = useState<string | undefined>(undefined);

  // Prefill state from AI chat assistant
  const [prefillConfig, setPrefillConfig] = useState<{
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    cleaningType: CleaningType;
    condition: HomeCondition;
    addOns: string[];
    frequency: CleaningFrequency;
  } | null>(null);

  // Callback when AI assistant generates a structured prefill
  const handleApplyAiPrefill = (config: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    cleaningType: CleaningType;
    condition: HomeCondition;
    addOns: string[];
    frequency: CleaningFrequency;
  }) => {
    setPrefillConfig(config);
    setActiveTab("booking");
  };

  // Callback when customer confirms booking in wizard
  const handleBookingConfirmed = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Callback to jump to SMS viewer for a specific booking
  const handleSelectBookingForSms = (booking: BookingRecord) => {
    setSelectedBookingForSms(booking.id);
    setActiveTab("sms");
  };

  // Reset entire demo
  const handleResetDemo = () => {
    setPricingRules(DEFAULT_PRICING_RULES);
    setBookings(SAMPLE_INITIAL_BOOKINGS);
    setPrefillConfig(null);
    setActiveTab("booking");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        bookingCount={bookings.length}
      />

      {/* Hero Header */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-panel-subtle)]/40 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Nassau County, NY Service Territory
              </span>
              <span className="text-xs text-[var(--color-text-muted)] flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-[var(--color-stripe-purple)]" />
                Massapequa • Garden City • Syosset • Merrick • Long Beach
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
              AI-Powered Residential Cleaning Booking System
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-2xl">
              Connected directly to your verified pricing formulas, multi-team availability, and operating policies so the AI never hallucinates pricing or arrival windows.
            </p>
          </div>

          {/* Quick Metrics Badge Pill */}
          <div className="flex items-center space-x-3 bg-[var(--color-panel)] border border-[var(--color-border)] rounded-2xl p-3 shadow-xs">
            <div className="text-center px-3 border-r border-[var(--color-border)]">
              <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] block">
                Crews Active
              </span>
              <span className="text-sm font-bold text-[var(--color-text-primary)] font-mono">
                2 Teams
              </span>
            </div>
            <div className="text-center px-3 border-r border-[var(--color-border)]">
              <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] block">
                Buffer Time
              </span>
              <span className="text-sm font-bold text-[var(--color-stripe-purple)] font-mono">
                45 Min
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] block">
                Pricing Math
              </span>
              <span className="text-sm font-bold text-emerald-600 font-mono">
                Deterministic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === "booking" && (
          <BookingWizard
            pricingRules={pricingRules}
            onBookingConfirmed={handleBookingConfirmed}
            prefillConfig={prefillConfig}
          />
        )}

        {activeTab === "assistant" && (
          <AiAssistant onApplyPrefill={handleApplyAiPrefill} />
        )}

        {activeTab === "admin" && (
          <AdminDashboard
            pricingRules={pricingRules}
            onUpdatePricingRules={setPricingRules}
            bookings={bookings}
            onSelectBookingForSmsView={handleSelectBookingForSms}
          />
        )}

        {activeTab === "sms" && (
          <SmsAuditViewer
            bookings={bookings}
            selectedBookingId={selectedBookingForSms}
          />
        )}
      </main>

      {/* Embedded Proposal & Technical Footer */}
      <Footer />
    </div>
  );
}
