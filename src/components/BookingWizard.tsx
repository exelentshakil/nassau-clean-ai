"use client";

import React, { useState, useMemo } from "react";
import {
  CleaningFrequency,
  CleaningType,
  HomeCondition,
  BookingRecord,
  CustomerDetails,
  PricingRulesConfig,
  TimeSlot,
} from "@/lib/types";
import { AVAILABLE_ADDONS, NASSAU_TOWNS, INITIAL_TEAMS } from "@/lib/constants";
import { calculateCleaningPrice } from "@/lib/pricing-engine";
import { formatCurrency } from "@/lib/utils";
import { generateBookingSmsAlerts } from "@/lib/sms-service";
import {
  Home,
  CheckCircle2,
  Calendar,
  CreditCard,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  Refrigerator,
  Maximize2,
  Layers,
  Dog,
  ShieldCheck,
  Clock,
  MapPin,
  AlertTriangle,
  Send,
  Lock,
  Phone,
  Check
} from "lucide-react";

interface BookingWizardProps {
  pricingRules: PricingRulesConfig;
  onBookingConfirmed: (booking: BookingRecord) => void;
  prefillConfig?: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    cleaningType: CleaningType;
    condition: HomeCondition;
    addOns: string[];
    frequency: CleaningFrequency;
  } | null;
}

export function BookingWizard({
  pricingRules,
  onBookingConfirmed,
  prefillConfig,
}: BookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Property details
  const [bedrooms, setBedrooms] = useState<number>(prefillConfig?.bedrooms ?? 3);
  const [bathrooms, setBathrooms] = useState<number>(prefillConfig?.bathrooms ?? 2);
  const [squareFeet, setSquareFeet] = useState<number>(prefillConfig?.sqft ?? 2000);
  const [cleaningType, setCleaningType] = useState<CleaningType>(prefillConfig?.cleaningType ?? "standard");
  const [homeCondition, setHomeCondition] = useState<HomeCondition>(prefillConfig?.condition ?? "normal");

  // Add-ons
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(prefillConfig?.addOns ?? []);

  // Frequency
  const [frequency, setFrequency] = useState<CleaningFrequency>(prefillConfig?.frequency ?? "biweekly");

  // Scheduling
  const [serviceDate, setServiceDate] = useState<string>("2026-09-17");
  const [selectedSlot, setSelectedSlot] = useState<string>("morning");
  const [assignedTeamId, setAssignedTeamId] = useState<string>("team-1");

  // Payment choice
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("deposit");
  const [cardNumber, setCardNumber] = useState<string>("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState<string>("12/28");
  const [cardCvc, setCardCvc] = useState<string>("892");

  // Customer Contact
  const [customer, setCustomer] = useState<CustomerDetails>({
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@gmail.com",
    phone: "(516) 555-7381",
    streetAddress: "284 Broadway",
    city: "Massapequa",
    zipCode: "11758",
    accessInstructions: "Side garage door code 1928#, alarm will be disarmed.",
    specialNotes: "Please pay extra attention to kitchen stove hood and powder room.",
  });

  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Live Deterministic Pricing Breakdown
  const pricing = useMemo(() => {
    return calculateCleaningPrice(
      {
        bedrooms,
        bathrooms,
        squareFeet,
        cleaningType,
        homeCondition,
        addOnIds: selectedAddOns,
        frequency,
      },
      pricingRules
    );
  }, [bedrooms, bathrooms, squareFeet, cleaningType, homeCondition, selectedAddOns, frequency, pricingRules]);

  // Toggle Add-on
  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1-Click Test Card Autofill
  const fillTestCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("08/29");
    setCardCvc("123");
  };

  // Complete Booking
  const handleFinalizeBooking = () => {
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const team = INITIAL_TEAMS.find((t) => t.id === assignedTeamId) || INITIAL_TEAMS[0];

    const amountPaid = paymentType === "deposit" ? pricing.depositRequired : pricing.finalTotal;
    const balanceDue = paymentType === "deposit" ? pricing.balanceDueOnCompletion : 0;

    const newBooking: BookingRecord = {
      id: bookingId,
      bookingReference: `NC-${Date.now().toString().slice(-6)}`,
      customer,
      serviceDate,
      timeSlot: selectedSlot === "morning" ? "08:30 AM - 12:00 PM" : "01:00 PM - 04:30 PM",
      assignedTeamId: team.id,
      assignedTeamName: team.name,
      pricing,
      payment: {
        type: paymentType,
        amountPaid,
        balanceDue,
        paymentMethod: "stripe_card",
        stripePaymentIntentId: `pi_test_${Date.now()}`,
        paidAt: new Date().toISOString(),
        receiptUrl: `https://stripe.com/receipts/test-${bookingId}`,
      },
      smsAlertsSent: [],
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Generate simulated Twilio notifications
    const smsList = generateBookingSmsAlerts(newBooking);
    newBooking.smsAlertsSent = smsList;

    setConfirmedBooking(newBooking);
    onBookingConfirmed(newBooking);
    setStep(6);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Step Progress Tracker */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center justify-center space-x-1.5 p-2 rounded-xl transition-all ${
              step === 1
                ? "bg-[var(--color-stripe-purple)] text-white font-bold"
                : step > 1
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            <span>1. Home Specs</span>
            {step > 1 && <Check className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={() => setStep(2)}
            className={`flex items-center justify-center space-x-1.5 p-2 rounded-xl transition-all ${
              step === 2
                ? "bg-[var(--color-stripe-purple)] text-white font-bold"
                : step > 2
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            <span>2. Add-Ons</span>
            {step > 2 && <Check className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={() => setStep(3)}
            className={`flex items-center justify-center space-x-1.5 p-2 rounded-xl transition-all ${
              step === 3
                ? "bg-[var(--color-stripe-purple)] text-white font-bold"
                : step > 3
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            <span>3. Frequency</span>
            {step > 3 && <Check className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={() => setStep(4)}
            className={`flex items-center justify-center space-x-1.5 p-2 rounded-xl transition-all ${
              step === 4
                ? "bg-[var(--color-stripe-purple)] text-white font-bold"
                : step > 4
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            <span>4. Schedule & Teams</span>
            {step > 4 && <Check className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={() => setStep(5)}
            className={`flex items-center justify-center space-x-1.5 p-2 rounded-xl transition-all ${
              step === 5
                ? "bg-[var(--color-stripe-purple)] text-white font-bold"
                : step === 6
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            <span>5. Stripe Payment</span>
            {step === 6 && <Check className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Form Steps + Sticky Pricing Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Area (Steps 1 to 5) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: HOME DETAILS & CONDITION */}
          {step === 1 && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                  <Home className="h-5 w-5 text-[var(--color-stripe-purple)]" />
                  <span>Step 1: Home Details & Cleaning Type</span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Specify your home layout in Nassau County. Pricing is calculated instantly with zero guesswork.
                </p>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">
                    Bedrooms
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBedrooms(num)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          bedrooms === num
                            ? "bg-[var(--color-stripe-purple)] text-white shadow-xs"
                            : "bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-panel-hover)]"
                        }`}
                      >
                        {num}{num === 6 ? "+" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">
                    Bathrooms
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 1.5, 2, 2.5, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBathrooms(num)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          bathrooms === num
                            ? "bg-[var(--color-stripe-purple)] text-white shadow-xs"
                            : "bg-[var(--color-panel-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-panel-hover)]"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Square Footage Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    Approximate Square Footage
                  </label>
                  <span className="text-sm font-bold text-[var(--color-stripe-purple)] font-mono">
                    {squareFeet.toLocaleString()} sq ft
                  </span>
                </div>
                <input
                  type="range"
                  min={800}
                  max={5000}
                  step={100}
                  value={squareFeet}
                  onChange={(e) => setSquareFeet(Number(e.target.value))}
                  className="w-full accent-[var(--color-stripe-purple)] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-1 font-mono">
                  <span>800 sq ft (Apartment)</span>
                  <span>2,000 sq ft (Average Colonial)</span>
                  <span>3,500 sq ft</span>
                  <span>5,000+ sq ft</span>
                </div>
              </div>

              {/* Cleaning Type Selection */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-2">
                  Cleaning Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "standard" as CleaningType,
                      title: "Standard Recurring Clean",
                      mult: "1.0x Base",
                      desc: "Routine wipe-down, bathrooms, dusting, kitchen exterior, and vacuum/mop floors.",
                    },
                    {
                      id: "deep" as CleaningType,
                      title: "Deep Intensive Scrub",
                      mult: "1.45x Base",
                      desc: "Adds hand-scrubbed baseboards, door frames, tile grout, exterior vents, and grease degreasing.",
                    },
                    {
                      id: "move_in_out" as CleaningType,
                      title: "Move-In / Move-Out Clean",
                      mult: "1.65x Base",
                      desc: "For empty homes: inside all closets, drawers, high dusting, and real-estate inspection prep.",
                    },
                    {
                      id: "post_construction" as CleaningType,
                      title: "Post-Renovation Clean",
                      mult: "1.90x Base",
                      desc: "Fine drywall dust extraction, sticker removal, air vent cleaning, and paint splatter wipe.",
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCleaningType(item.id)}
                      className={`p-4 rounded-xl text-left border transition-all ${
                        cleaningType === item.id
                          ? "border-[var(--color-stripe-purple)] bg-[var(--color-stripe-purple)]/5 ring-1 ring-[var(--color-stripe-purple)]"
                          : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[var(--color-text-primary)]">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold text-[var(--color-stripe-purple)] font-mono">
                          {item.mult}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Home Condition & Extra Time Modifier (Explicit Client Brief Requirement) */}
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Home Condition & Extra Time Allocation
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Per company guidelines, select if the home has heavy soap scum, grease, pet hair, or clutter requiring extra hours.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    {
                      id: "normal" as HomeCondition,
                      label: "Normal Condition",
                      badge: "Standard Time",
                      desc: "Cleaned regularly, mild surface dust.",
                    },
                    {
                      id: "heavy" as HomeCondition,
                      label: "Heavy Buildup (+25%)",
                      badge: "+1.5 Hours Allotted",
                      desc: "Hasn't been cleaned in 2-4 months, heavy grease/grime.",
                    },
                    {
                      id: "extreme" as HomeCondition,
                      label: "Extreme Dirt (+50%)",
                      badge: "+3.0 Hours Allotted",
                      desc: "Severe buildup, neglect, or heavy pet hair clutter.",
                    },
                  ].map((cond) => (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setHomeCondition(cond.id)}
                      className={`p-3 rounded-lg text-left border transition-all text-xs ${
                        homeCondition === cond.id
                          ? "border-amber-500 bg-white dark:bg-slate-900 shadow-xs font-bold text-amber-950 dark:text-amber-200"
                          : "border-amber-200/60 dark:border-amber-900/40 bg-transparent text-amber-900/80 dark:text-amber-400 hover:bg-amber-100/40"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{cond.label}</span>
                      </div>
                      <span className="text-[10px] block font-mono text-amber-700 dark:text-amber-400 mt-0.5">
                        {cond.badge}
                      </span>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-normal">
                        {cond.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center space-x-2 rounded-xl bg-[var(--color-stripe-purple)] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--color-stripe-purple-hover)] transition-colors"
                >
                  <span>Continue to Add-Ons</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ADD-ONS */}
          {step === 2 && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-[var(--color-stripe-purple)]" />
                  <span>Step 2: Specialty Add-Ons & Extras</span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Select additional detail services. Each adds calibrated extra labor time to your clean.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_ADDONS.map((addon) => {
                  const isSelected = selectedAddOns.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-4 rounded-xl text-left border transition-all flex items-start space-x-3.5 ${
                        isSelected
                          ? "border-[var(--color-stripe-purple)] bg-[var(--color-stripe-purple)]/5 ring-1 ring-[var(--color-stripe-purple)]"
                          : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:bg-[var(--color-panel-hover)]"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[var(--color-stripe-purple)] text-white"
                            : "bg-[var(--color-panel)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                        }`}
                      >
                        {addon.id === "oven" && <Flame className="h-5 w-5" />}
                        {addon.id === "fridge" && <Refrigerator className="h-5 w-5" />}
                        {addon.id === "windows" && <Maximize2 className="h-5 w-5" />}
                        {addon.id === "cabinets" && <Layers className="h-5 w-5" />}
                        {addon.id === "baseboards" && <Sparkles className="h-5 w-5" />}
                        {addon.id === "pethair" && <Dog className="h-5 w-5" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-[var(--color-text-primary)]">
                            {addon.name}
                          </span>
                          <span className="text-xs font-bold text-[var(--color-stripe-purple)] font-mono">
                            +${addon.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                          {addon.description}
                        </p>
                        <span className="inline-flex items-center text-[10px] text-slate-500 mt-1 font-mono">
                          <Clock className="mr-1 h-3 w-3" />
                          +{addon.durationMinutes} min
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center space-x-2 rounded-xl bg-[var(--color-stripe-purple)] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--color-stripe-purple-hover)]"
                >
                  <span>Continue to Frequency</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FREQUENCY & DISCOUNTS */}
          {step === 3 && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[var(--color-stripe-purple)]" />
                  <span>Step 3: Cleaning Frequency & Recurring Discounts</span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Save up to 20% on recurring appointments. Easily reschedule or skip visits online anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: "weekly" as CleaningFrequency,
                    title: "Weekly Clean",
                    discount: "Save 20%",
                    badge: "Best Value",
                    desc: "Ideal for active families and homes with pets.",
                  },
                  {
                    id: "biweekly" as CleaningFrequency,
                    title: "Bi-Weekly Clean",
                    discount: "Save 15%",
                    badge: "Most Popular",
                    desc: "Every 2 weeks — keeps your home perpetually pristine.",
                  },
                  {
                    id: "monthly" as CleaningFrequency,
                    title: "Monthly Clean",
                    discount: "Save 10%",
                    badge: "Maintenance",
                    desc: "Once every 4 weeks for consistent maintenance.",
                  },
                  {
                    id: "one_time" as CleaningFrequency,
                    title: "One-Time Clean",
                    discount: "Full Price",
                    badge: "Standard",
                    desc: "No recurring schedule or ongoing commitment.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFrequency(item.id)}
                    className={`p-5 rounded-2xl text-left border transition-all relative overflow-hidden ${
                      frequency === item.id
                        ? "border-[var(--color-stripe-purple)] bg-[var(--color-stripe-purple)]/5 ring-2 ring-[var(--color-stripe-purple)]"
                        : "border-[var(--color-border)] bg-[var(--color-panel-subtle)] hover:bg-[var(--color-panel-hover)]"
                    }`}
                  >
                    {item.badge === "Most Popular" && (
                      <span className="absolute top-0 right-0 rounded-bl-lg bg-[var(--color-stripe-purple)] px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        Popular
                      </span>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        {item.title}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {item.discount}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center space-x-2 rounded-xl bg-[var(--color-stripe-purple)] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--color-stripe-purple-hover)]"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SCHEDULING & TIME SLOTS */}
          {step === 4 && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-[var(--color-stripe-purple)]" />
                  <span>Step 4: Select Service Date & Arrival Window</span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Our algorithm assigns our Nassau County crews (South Shore or North Shore) with built-in 45-minute travel buffers.
                </p>
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">
                    Cleaning Date
                  </label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    min="2026-09-15"
                    max="2026-10-31"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1.5">
                    Dispatch Team Assignment
                  </label>
                  <select
                    value={assignedTeamId}
                    onChange={(e) => setAssignedTeamId(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  >
                    {INITIAL_TEAMS.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} ({team.serviceTerritory})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-2">
                  Available Arrival Windows (Double-Booking Protected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot("morning")}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      selectedSlot === "morning"
                        ? "border-[var(--color-stripe-purple)] bg-[var(--color-stripe-purple)]/5 ring-1 ring-[var(--color-stripe-purple)]"
                        : "border-[var(--color-border)] bg-[var(--color-panel-subtle)]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">
                        Morning Window
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        Open Slot
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-stripe-purple)] block mt-1 font-mono">
                      08:30 AM - 12:00 PM
                    </span>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      Includes 45 min arrival buffer & team equipment check.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedSlot("afternoon")}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      selectedSlot === "afternoon"
                        ? "border-[var(--color-stripe-purple)] bg-[var(--color-stripe-purple)]/5 ring-1 ring-[var(--color-stripe-purple)]"
                        : "border-[var(--color-border)] bg-[var(--color-panel-subtle)]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">
                        Afternoon Window
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                        Open Slot
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[var(--color-stripe-purple)] block mt-1 font-mono">
                      01:00 PM - 04:30 PM
                    </span>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      Full afternoon clean window. Great for working professionals.
                    </p>
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="inline-flex items-center space-x-2 rounded-xl bg-[var(--color-stripe-purple)] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--color-stripe-purple-hover)]"
                >
                  <span>Customer & Payment Info</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CUSTOMER & STRIPE PAYMENT */}
          {step === 5 && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-[var(--color-stripe-purple)]" />
                  <span>Step 5: Contact Details & Stripe Checkout</span>
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Enter your address in Nassau County. SMS confirmations will be dispatched via Twilio to your phone.
                </p>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={customer.firstName}
                    onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={customer.lastName}
                    onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
                    Email Address (For receipts)
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1 flex items-center justify-between">
                    <span>Mobile Phone (For Twilio SMS)</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">SMS Reminders</span>
                  </label>
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
                    Street Address (Service Location)
                  </label>
                  <input
                    type="text"
                    value={customer.streetAddress}
                    onChange={(e) => setCustomer({ ...customer, streetAddress: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
                    Nassau County Town
                  </label>
                  <select
                    value={customer.city}
                    onChange={(e) => {
                      const town = NASSAU_TOWNS.find((t) => t.name === e.target.value);
                      setCustomer({
                        ...customer,
                        city: e.target.value,
                        zipCode: town ? town.zip : customer.zipCode,
                      });
                    }}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  >
                    {NASSAU_TOWNS.map((town) => (
                      <option key={town.name} value={town.name}>
                        {town.name} ({town.zip}) — {town.territory}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={customer.zipCode}
                    onChange={(e) => setCustomer({ ...customer, zipCode: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)] block mb-1">
                    Entry & Access Instructions (Gate code, key under mat, lockbox)
                  </label>
                  <input
                    type="text"
                    value={customer.accessInstructions}
                    onChange={(e) => setCustomer({ ...customer, accessInstructions: e.target.value })}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
                  />
                </div>
              </div>

              {/* Stripe Payment Option: Deposit vs Full Payment */}
              <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
                <span className="text-xs font-bold text-[var(--color-text-primary)] block">
                  Payment Preference (Stripe Integration)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType("deposit")}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      paymentType === "deposit"
                        ? "border-[var(--color-stripe-purple)] bg-[var(--color-stripe-purple)]/5 ring-1 ring-[var(--color-stripe-purple)]"
                        : "border-[var(--color-border)] bg-[var(--color-panel-subtle)]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">
                        Pay 25% Deposit Now
                      </span>
                      <span className="text-sm font-bold text-[var(--color-stripe-purple)] font-mono">
                        {formatCurrency(pricing.depositRequired)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      Hold appointment with deposit. Balance of {formatCurrency(pricing.balanceDueOnCompletion)} charged upon completion.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType("full")}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      paymentType === "full"
                        ? "border-[var(--color-stripe-purple)] bg-[var(--color-stripe-purple)]/5 ring-1 ring-[var(--color-stripe-purple)]"
                        : "border-[var(--color-border)] bg-[var(--color-panel-subtle)]"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">
                        Pay Full Amount Now
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatCurrency(pricing.finalTotal)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                      Clean hands-free. No payment step needed when the team completes the clean.
                    </p>
                  </button>
                </div>

                {/* Stripe Elements Mock */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--color-text-secondary)] flex items-center space-x-1.5">
                      <Lock className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Encrypted Card Payment (Stripe PCI-DSS)</span>
                    </span>
                    <button
                      type="button"
                      onClick={fillTestCard}
                      className="text-[11px] text-[var(--color-stripe-purple)] hover:underline font-medium"
                    >
                      Fill 4242 Test Card
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-xs font-mono text-[var(--color-text-primary)]"
                        placeholder="Card Number"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-2 text-xs font-mono text-[var(--color-text-primary)]"
                        placeholder="MM/YY"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation & Submit */}
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center space-x-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalizeBooking}
                  className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[var(--color-stripe-purple)] to-[#00d4b2] px-7 py-3 text-sm font-bold text-white shadow-md hover:opacity-95 transition-opacity"
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    Book Cleaning ({formatCurrency(paymentType === "deposit" ? pricing.depositRequired : pricing.finalTotal)})
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: BOOKING CONFIRMATION & TWILIO DISPATCH POPUP */}
          {step === 6 && confirmedBooking && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-8 shadow-xs text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                  Booking Confirmed & Dispatched
                </span>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                  Thank you, {confirmedBooking.customer.firstName}!
                </h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-md mx-auto">
                  Your cleaning appointment is scheduled for {confirmedBooking.serviceDate} ({confirmedBooking.timeSlot}) at your home in {confirmedBooking.customer.city}, NY.
                </p>
                <div className="inline-block mt-3 rounded-md bg-[var(--color-panel-subtle)] px-3 py-1 text-xs font-mono font-bold text-[var(--color-text-primary)] border border-[var(--color-border)]">
                  Reference ID: {confirmedBooking.bookingReference}
                </div>
              </div>

              {/* Twilio SMS Simulation Alert Box */}
              <div className="rounded-2xl border border-[var(--color-stripe-purple)]/30 bg-[var(--color-stripe-purple)]/5 p-5 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--color-stripe-purple)] flex items-center space-x-1.5">
                    <Phone className="h-4 w-4" />
                    <span>Twilio SMS Automations Dispatched</span>
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    2 Messages Delivered
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-3 text-xs">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] block uppercase">
                      SMS to Customer ({confirmedBooking.customer.phone})
                    </span>
                    <p className="mt-1 font-mono text-[11px] text-[var(--color-text-primary)]">
                      {confirmedBooking.smsAlertsSent[0]?.messageText}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-3 text-xs">
                    <span className="text-[10px] font-bold text-[var(--color-text-muted)] block uppercase">
                      SMS to Cleaning Team ({confirmedBooking.assignedTeamName})
                    </span>
                    <p className="mt-1 font-mono text-[11px] text-[var(--color-text-primary)]">
                      {confirmedBooking.smsAlertsSent[1]?.messageText}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center space-x-2 rounded-xl bg-[var(--color-stripe-purple)] px-6 py-2.5 text-xs font-bold text-white hover:bg-[var(--color-stripe-purple-hover)]"
                >
                  <span>Book Another Appointment</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Dynamic Pricing Breakdown Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
              <div>
                <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Live Pricing Breakdown
                </h4>
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  Deterministic Rule Engine
                </span>
              </div>
              <span className="rounded-full bg-[var(--color-stripe-purple)]/10 px-2.5 py-1 text-xs font-bold text-[var(--color-stripe-purple)] font-mono">
                {frequency.toUpperCase()}
              </span>
            </div>

            {/* Line items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>Base Service Rate:</span>
                <span className="font-mono font-medium">{formatCurrency(pricing.basePrice)}</span>
              </div>

              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>{bedrooms} Bedrooms (${pricingRules.perBedroom}/ea):</span>
                <span className="font-mono font-medium">{formatCurrency(pricing.bedroomPrice)}</span>
              </div>

              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>{bathrooms} Bathrooms (${pricingRules.perBathroom}/ea):</span>
                <span className="font-mono font-medium">{formatCurrency(pricing.bathroomPrice)}</span>
              </div>

              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>Square Footage ({squareFeet.toLocaleString()} sqft):</span>
                <span className="font-mono font-medium">{formatCurrency(pricing.sqftPrice)}</span>
              </div>

              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>Cleaning Type Multiplier:</span>
                <span className="font-mono font-bold text-[var(--color-stripe-purple)]">
                  {pricing.typeMultiplier}x ({cleaningType.toUpperCase()})
                </span>
              </div>

              {pricing.conditionMultiplier > 1.0 && (
                <div className="flex justify-between text-amber-600 font-medium">
                  <span>Condition Surcharge:</span>
                  <span className="font-mono">
                    +{Math.round((pricing.conditionMultiplier - 1) * 100)}% ({homeCondition.toUpperCase()})
                  </span>
                </div>
              )}

              {pricing.addOnsTotal > 0 && (
                <div className="pt-2 border-t border-dashed border-[var(--color-border)]">
                  <span className="text-[11px] font-bold text-[var(--color-text-primary)] block mb-1">
                    Selected Add-Ons ({pricing.addOnsSelected.length}):
                  </span>
                  {pricing.addOnsSelected.map((addon) => (
                    <div key={addon.id} className="flex justify-between text-[11px] text-[var(--color-text-muted)] py-0.5">
                      <span>• {addon.name}</span>
                      <span className="font-mono">{formatCurrency(addon.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {pricing.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold pt-1">
                  <span>{frequency.toUpperCase()} Discount ({pricing.frequencyDiscountPercent}%):</span>
                  <span className="font-mono">-{formatCurrency(pricing.discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Total & Deposit Box */}
            <div className="pt-4 border-t border-[var(--color-border)] space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">Total Price:</span>
                <span className="text-2xl font-bold text-[var(--color-stripe-purple)] font-mono">
                  {formatCurrency(pricing.finalTotal)}
                </span>
              </div>

              <div className="rounded-xl bg-[var(--color-panel-subtle)] p-3 border border-[var(--color-border)] space-y-1 text-xs">
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>25% Deposit Required:</span>
                  <span className="font-bold text-[var(--color-text-primary)] font-mono">
                    {formatCurrency(pricing.depositRequired)}
                  </span>
                </div>
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Balance on Completion:</span>
                  <span className="font-mono">{formatCurrency(pricing.balanceDueOnCompletion)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-[var(--color-text-muted)]">
                <Clock className="h-3.5 w-3.5 text-sky-500" />
                <span>Estimated Cleaning Duration: <strong>{pricing.estimatedLaborHours} hours</strong></span>
              </div>

              {/* Basis explanation string */}
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/50 p-2.5 text-[10px] text-[var(--color-text-muted)] font-mono leading-relaxed border border-[var(--color-border)]">
                {pricing.calculationBasis}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
