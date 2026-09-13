"use client";

import React, { useState } from "react";
import { PricingRulesConfig, BookingRecord, CleaningTeam } from "@/lib/types";
import { DEFAULT_PRICING_RULES, INITIAL_TEAMS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  Sliders,
  Calendar,
  Users,
  DollarSign,
  Save,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle,
  FileText,
  PhoneCall,
  ShieldAlert
} from "lucide-react";

interface AdminDashboardProps {
  pricingRules: PricingRulesConfig;
  onUpdatePricingRules: (newRules: PricingRulesConfig) => void;
  bookings: BookingRecord[];
  onSelectBookingForSmsView?: (booking: BookingRecord) => void;
}

export function AdminDashboard({
  pricingRules,
  onUpdatePricingRules,
  bookings,
  onSelectBookingForSmsView,
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"rules" | "teams" | "bookings">("rules");
  const [draftRules, setDraftRules] = useState<PricingRulesConfig>(pricingRules);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [teams, setTeams] = useState<CleaningTeam[]>(INITIAL_TEAMS);

  // Handle saving pricing rules
  const handleSaveRules = () => {
    onUpdatePricingRules(draftRules);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Reset to factory defaults
  const handleResetDefaults = () => {
    setDraftRules(DEFAULT_PRICING_RULES);
    onUpdatePricingRules(DEFAULT_PRICING_RULES);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Toggle team active status
  const toggleTeamStatus = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, active: !t.active } : t))
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner explaining Owner Control without Developer involvement */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-[var(--color-stripe-purple)] font-mono uppercase">
              Business Owner Control Panel
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
              Zero Developer Dependency
            </span>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mt-1">
            Rules, Costbook & Crew Dispatch Engine
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Adjust rates, add-on pricing, condition surcharges, or team schedules in real time. Changes immediately update both the Booking Wizard and the Grounded AI Concierge.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center space-x-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-1.5">
          <button
            type="button"
            onClick={() => setActiveSubTab("rules")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === "rules"
                ? "bg-[var(--color-stripe-purple)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Pricing Rules</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("teams")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === "teams"
                ? "bg-[var(--color-stripe-purple)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Crews & Buffers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("bookings")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeSubTab === "bookings"
                ? "bg-[var(--color-stripe-purple)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Live Bookings ({bookings.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DYNAMIC PRICING RULES EDITOR */}
      {activeSubTab === "rules" && (
        <div className="space-y-6">
          {saveSuccess && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center space-x-2 animate-in fade-in duration-200">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                Pricing rules updated successfully! The new rates are now live in the Booking Wizard and AI knowledge base.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Base Rates & Room Units */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-[var(--color-stripe-purple)]" />
                <span>Base Rates & Room Fees</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Base Service Fee</label>
                    <span className="font-mono font-bold text-[var(--color-stripe-purple)]">
                      ${draftRules.baseRate}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={60}
                    max={150}
                    step={5}
                    value={draftRules.baseRate}
                    onChange={(e) =>
                      setDraftRules({ ...draftRules, baseRate: Number(e.target.value) })
                    }
                    className="w-full accent-[var(--color-stripe-purple)]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Rate Per Bedroom</label>
                    <span className="font-mono font-bold text-[var(--color-stripe-purple)]">
                      ${draftRules.perBedroom}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={45}
                    step={5}
                    value={draftRules.perBedroom}
                    onChange={(e) =>
                      setDraftRules({ ...draftRules, perBedroom: Number(e.target.value) })
                    }
                    className="w-full accent-[var(--color-stripe-purple)]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Rate Per Bathroom</label>
                    <span className="font-mono font-bold text-[var(--color-stripe-purple)]">
                      ${draftRules.perBathroom}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={55}
                    step={5}
                    value={draftRules.perBathroom}
                    onChange={(e) =>
                      setDraftRules({ ...draftRules, perBathroom: Number(e.target.value) })
                    }
                    className="w-full accent-[var(--color-stripe-purple)]"
                  />
                </div>
              </div>
            </div>

            {/* Cleaning Type Multipliers */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-[var(--color-stripe-purple)]" />
                <span>Package Multipliers</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Standard Recurring</label>
                    <span className="font-mono font-bold">{draftRules.typeMultipliers.standard}x</span>
                  </div>
                  <p className="text-[10px] text-[var(--color-text-muted)]">Locked baseline multiplier</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Deep Clean Multiplier</label>
                    <span className="font-mono font-bold text-[var(--color-stripe-purple)]">
                      {draftRules.typeMultipliers.deep}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1.2}
                    max={1.8}
                    step={0.05}
                    value={draftRules.typeMultipliers.deep}
                    onChange={(e) =>
                      setDraftRules({
                        ...draftRules,
                        typeMultipliers: {
                          ...draftRules.typeMultipliers,
                          deep: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[var(--color-stripe-purple)]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Move-In/Move-Out Multiplier</label>
                    <span className="font-mono font-bold text-[var(--color-stripe-purple)]">
                      {draftRules.typeMultipliers.move_in_out}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1.4}
                    max={2.0}
                    step={0.05}
                    value={draftRules.typeMultipliers.move_in_out}
                    onChange={(e) =>
                      setDraftRules({
                        ...draftRules,
                        typeMultipliers: {
                          ...draftRules.typeMultipliers,
                          move_in_out: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[var(--color-stripe-purple)]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Post-Construction Multiplier</label>
                    <span className="font-mono font-bold text-[var(--color-stripe-purple)]">
                      {draftRules.typeMultipliers.post_construction}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1.6}
                    max={2.5}
                    step={0.05}
                    value={draftRules.typeMultipliers.post_construction}
                    onChange={(e) =>
                      setDraftRules({
                        ...draftRules,
                        typeMultipliers: {
                          ...draftRules.typeMultipliers,
                          post_construction: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[var(--color-stripe-purple)]"
                  />
                </div>
              </div>
            </div>

            {/* Home Condition Modifiers & Extra Labor Time */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Condition Surcharges & Allotted Hours</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--color-text-primary)]">Heavy Buildup</span>
                    <span className="font-mono font-bold text-amber-600">
                      +{Math.round((draftRules.conditionMultipliers.heavy - 1) * 100)}% Price / +{draftRules.conditionExtraHours.heavy} hrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1.1}
                    max={1.4}
                    step={0.05}
                    value={draftRules.conditionMultipliers.heavy}
                    onChange={(e) =>
                      setDraftRules({
                        ...draftRules,
                        conditionMultipliers: {
                          ...draftRules.conditionMultipliers,
                          heavy: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[var(--color-text-primary)]">Extreme Grime / Neglect</span>
                    <span className="font-mono font-bold text-amber-600">
                      +{Math.round((draftRules.conditionMultipliers.extreme - 1) * 100)}% Price / +{draftRules.conditionExtraHours.extreme} hrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1.3}
                    max={1.8}
                    step={0.05}
                    value={draftRules.conditionMultipliers.extreme}
                    onChange={(e) =>
                      setDraftRules({
                        ...draftRules,
                        conditionMultipliers: {
                          ...draftRules.conditionMultipliers,
                          extreme: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Recurring Frequency Discounts */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span>Recurring Subscription Discounts</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Weekly Recurring Discount</label>
                    <span className="font-mono font-bold text-emerald-600">
                      {draftRules.frequencyDiscounts.weekly}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={30}
                    step={1}
                    value={draftRules.frequencyDiscounts.weekly}
                    onChange={(e) =>
                      setDraftRules({
                        ...draftRules,
                        frequencyDiscounts: {
                          ...draftRules.frequencyDiscounts,
                          weekly: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Bi-Weekly Recurring Discount</label>
                    <span className="font-mono font-bold text-emerald-600">
                      {draftRules.frequencyDiscounts.biweekly}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={draftRules.frequencyDiscounts.biweekly}
                    onChange={(e) =>
                      setDraftRules({
                        ...draftRules,
                        frequencyDiscounts: {
                          ...draftRules.frequencyDiscounts,
                          biweekly: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-medium text-[var(--color-text-secondary)]">Monthly Discount</label>
                    <span className="font-mono font-bold text-emerald-600">
                      {draftRules.frequencyDiscounts.monthly}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={draftRules.frequencyDiscounts.monthly}
                    onChange={(e) =>
                      setDraftRules({
                        ...draftRules,
                        frequencyDiscounts: {
                          ...draftRules.frequencyDiscounts,
                          monthly: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Bar */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-4 py-2 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSaveRules}
              className="inline-flex items-center space-x-2 rounded-xl bg-[var(--color-stripe-purple)] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--color-stripe-purple-hover)] transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save & Publish Live Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CREW DISPATCH & TRAVEL BUFFER VIEW */}
      {activeSubTab === "teams" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 shadow-xs space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                      {team.name}
                    </h3>
                    <span className="text-xs text-[var(--color-text-muted)] flex items-center mt-0.5">
                      <MapPin className="h-3 w-3 mr-1 text-[var(--color-stripe-purple)]" />
                      {team.serviceTerritory}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleTeamStatus(team.id)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                      team.active
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600"
                    }`}
                  >
                    {team.active ? "Active for Dispatch" : "Off-Duty / Leave"}
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Crew Lead:</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">{team.crewLead}</span>
                  </div>

                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Crew Size:</span>
                    <span>{team.membersCount} Pro Cleaners</span>
                  </div>

                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Max Jobs Per Day:</span>
                    <span className="font-mono">{team.maxJobsPerDay} Appointments</span>
                  </div>

                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Enforced Travel Buffer:</span>
                    <span className="font-mono text-[var(--color-stripe-purple)] font-bold">
                      {team.travelBufferMinutes} Minutes Between Jobs
                    </span>
                  </div>
                </div>

                {/* Simulated Shift Visualizer */}
                <div className="pt-3 border-t border-[var(--color-border)]">
                  <span className="text-[11px] font-bold text-[var(--color-text-primary)] block mb-2">
                    Daily Schedule & Buffer Slots:
                  </span>
                  <div className="space-y-1.5 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 flex justify-between border border-sky-200/50">
                      <span>08:30 AM - 12:00 PM</span>
                      <span className="font-bold">Slot 1 (Morning Clean)</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 flex justify-between border border-amber-200/50 text-[10px]">
                      <span>12:00 PM - 12:45 PM</span>
                      <span>45m Travel Buffer & Lunch Transit</span>
                    </div>
                    <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 flex justify-between border border-sky-200/50">
                      <span>01:00 PM - 04:30 PM</span>
                      <span className="font-bold">Slot 2 (Afternoon Clean)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LIVE BOOKINGS ROSTER */}
      {activeSubTab === "bookings" && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[var(--color-border)] flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Active Bookings in Nassau County
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Real-time appointments, assigned teams, collected deposits, and Twilio SMS logs.
              </p>
            </div>
            <span className="rounded-full bg-[var(--color-stripe-purple)]/10 px-3 py-1 text-xs font-bold text-[var(--color-stripe-purple)] font-mono">
              {bookings.length} Total Bookings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-panel-subtle)] text-[var(--color-text-secondary)] font-semibold border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-4 py-3">Ref ID</th>
                  <th className="px-4 py-3">Customer & Location</th>
                  <th className="px-4 py-3">Service Date / Time</th>
                  <th className="px-4 py-3">Assigned Crew</th>
                  <th className="px-4 py-3">Total / Deposit</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Twilio SMS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[var(--color-panel-hover)] transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-[var(--color-stripe-purple)]">
                      {b.bookingReference}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[var(--color-text-primary)]">
                        {b.customer.firstName} {b.customer.lastName}
                      </div>
                      <div className="text-[11px] text-[var(--color-text-muted)] flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-slate-400" />
                        {b.customer.streetAddress}, {b.customer.city}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-[var(--color-text-primary)]">{b.serviceDate}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)]">{b.timeSlot}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {b.assignedTeamName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold font-mono text-[var(--color-text-primary)]">
                        {formatCurrency(b.pricing.finalTotal)}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-mono">
                        Deposit: {formatCurrency(b.payment.amountPaid)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {onSelectBookingForSmsView ? (
                        <button
                          type="button"
                          onClick={() => onSelectBookingForSmsView(b)}
                          className="inline-flex items-center space-x-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-stripe-purple)] hover:bg-[var(--color-stripe-purple)] hover:text-white transition-colors"
                        >
                          <PhoneCall className="h-3 w-3" />
                          <span>View SMS ({b.smsAlertsSent.length})</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {b.smsAlertsSent.length} sent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
