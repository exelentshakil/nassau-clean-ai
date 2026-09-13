"use client";

import React, { useState } from "react";
import { BookingRecord, SmsNotification } from "@/lib/types";
import {
  MessageSquare,
  Smartphone,
  CheckCheck,
  Clock,
  Send,
  Users,
  User,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface SmsAuditViewerProps {
  bookings: BookingRecord[];
  selectedBookingId?: string;
}

export function SmsAuditViewer({ bookings, selectedBookingId }: SmsAuditViewerProps) {
  const [activeBookingId, setActiveBookingId] = useState<string>(
    selectedBookingId || (bookings[0] ? bookings[0].id : "")
  );

  const currentBooking = bookings.find((b) => b.id === activeBookingId) || bookings[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 font-mono">
              Twilio SMS Integration
            </span>
            <span className="rounded-full bg-[var(--color-stripe-purple)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-stripe-purple)]">
              Real-Time Dispatched
            </span>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mt-1">
            Automated SMS Notifications & Dispatch Alerts
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Demonstrates automated SMS delivery for customer confirmations, crew work orders, and 24-hour reminder triggers.
          </p>
        </div>

        {/* Booking selector */}
        {bookings.length > 1 && (
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] whitespace-nowrap">
              Select Booking:
            </label>
            <select
              value={activeBookingId}
              onChange={(e) => setActiveBookingId(e.target.value)}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-3 py-1.5 text-xs font-mono text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
            >
              {bookings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bookingReference} — {b.customer.firstName} ({b.customer.city})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {currentBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[320px] rounded-[40px] border-[6px] border-slate-800 bg-slate-950 p-4 shadow-2xl space-y-3 relative text-white">
              {/* Dynamic Island / Notch */}
              <div className="h-5 w-28 bg-slate-800 rounded-full mx-auto" />

              {/* Status Header */}
              <div className="text-center pb-2 border-b border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 block">Messages</span>
                <span className="text-xs font-bold text-slate-100 flex items-center justify-center space-x-1">
                  <span>Nassau Clean (Twilio)</span>
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                </span>
                <span className="text-[9px] text-slate-500 font-mono">+1 (516) 708-CLEAN</span>
              </div>

              {/* Messages Body */}
              <div className="space-y-3 py-2 h-[380px] overflow-y-auto pr-1">
                {currentBooking.smsAlertsSent.map((sms) => (
                  <div key={sms.id} className="space-y-1">
                    <div
                      className={`p-3 rounded-2xl text-[11px] leading-relaxed ${
                        sms.recipientType === "customer"
                          ? "bg-[#635bff] text-white rounded-br-none"
                          : "bg-slate-800 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[9px] opacity-75 mb-1 pb-1 border-b border-white/20">
                        <span>
                          {sms.recipientType === "customer" ? "To Customer" : "To Crew Lead"}
                        </span>
                        <span>{sms.scheduledFor.slice(11, 16)} EST</span>
                      </div>
                      <p className="font-mono text-[10px] leading-tight">{sms.messageText}</p>
                    </div>

                    <div className="flex items-center justify-end space-x-1 text-[9px] text-slate-400 px-1">
                      <span>Delivered</span>
                      <CheckCheck className="h-3 w-3 text-sky-400" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="h-1 w-28 bg-slate-700 rounded-full mx-auto mt-2" />
            </div>
          </div>

          {/* Right Column: Detailed SMS Feed Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Twilio Dispatch Log for Reference #{currentBooking.bookingReference}
            </h3>

            <div className="space-y-3">
              {currentBooking.smsAlertsSent.map((sms, index) => (
                <div
                  key={sms.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="h-7 w-7 rounded-lg bg-[var(--color-panel-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-stripe-purple)]">
                        {sms.recipientType === "customer" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Users className="h-4 w-4" />
                        )}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-[var(--color-text-primary)] block">
                          {sms.recipientType === "customer"
                            ? `Customer Notification (${sms.recipientPhone})`
                            : `Crew Dispatch Work Order (${sms.recipientPhone})`}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                          Trigger: {sms.id.startsWith("sms-conf") ? "Instant Webhook on Stripe Payment" : "Crew Dispatch Queue"}
                        </span>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono">
                      {sms.status}
                    </span>
                  </div>

                  <div className="rounded-xl bg-[var(--color-panel-subtle)] p-3 text-xs font-mono text-[var(--color-text-primary)] leading-relaxed border border-[var(--color-border)]">
                    {sms.messageText}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-[var(--color-text-muted)] pt-1 border-t border-[var(--color-border)]">
                    <span>Twilio SID: SM{Math.random().toString(36).substring(2, 12)}</span>
                    <span className="font-mono">Scheduled: {sms.scheduledFor}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Note about 24h SMS reminder trigger */}
            <div className="rounded-xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 p-3.5 text-xs text-sky-800 dark:text-sky-300 flex items-start space-x-2.5">
              <Clock className="h-4 w-4 shrink-0 mt-0.5 text-sky-600" />
              <div>
                <span className="font-bold block">Automated 24-Hour Pre-Clean SMS Reminder:</span>
                <p className="text-[11px] text-sky-700 dark:text-sky-300 mt-0.5">
                  Scheduled to automatically fire via Inngest cron 24 hours prior to appointment ({currentBooking.serviceDate} at 8:00 AM) to verify entry instructions and lock cancellation window.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[var(--color-text-muted)]">
          No bookings created yet. Complete a booking in the Booking Wizard to see live Twilio alerts generated here.
        </div>
      )}
    </div>
  );
}
