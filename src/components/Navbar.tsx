"use client";

import React from "react";
import { useTheme } from "next-themes";
import {
  Sparkles,
  Calendar,
  Bot,
  Sliders,
  MessageSquareText,
  Sun,
  Moon,
  RotateCcw,
  CheckCircle2,
  MapPin
} from "lucide-react";

interface NavbarProps {
  activeTab: "booking" | "assistant" | "admin" | "sms";
  setActiveTab?: (tab: "booking" | "assistant" | "admin" | "sms") => void;
  onTabChange?: (tab: "booking" | "assistant" | "admin" | "sms") => void;
  onResetDemo: () => void;
  bookingCount?: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onTabChange,
  onResetDemo,
  bookingCount = 0,
}: NavbarProps) {
  const { theme, setTheme } = useTheme();

  const handleTabChange = (tab: "booking" | "assistant" | "admin" | "sms") => {
    if (setActiveTab) setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-panel)]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-stripe-purple)] text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-[var(--color-text-primary)]">
                  NassauClean.AI
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Massapequa, NY
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
                Deterministic Residential Cleaning & AI Dispatch System
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 rounded-xl bg-[var(--color-panel-subtle)] p-1 border border-[var(--color-border)]">
            <button
              onClick={() => handleTabChange("booking")}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "booking"
                  ? "bg-[var(--color-panel)] text-[var(--color-stripe-purple)] shadow-xs border border-[var(--color-border)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Booking Wizard</span>
            </button>

            <button
              onClick={() => handleTabChange("assistant")}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "assistant"
                  ? "bg-[var(--color-panel)] text-[var(--color-stripe-purple)] shadow-xs border border-[var(--color-border)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Grounded AI Chat</span>
              <span className="rounded-full bg-[var(--color-stripe-purple)]/10 px-1.5 py-0.2 text-[9px] text-[var(--color-stripe-purple)]">
                Zero Hallucination
              </span>
            </button>

            <button
              onClick={() => handleTabChange("admin")}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "admin"
                  ? "bg-[var(--color-panel)] text-[var(--color-stripe-purple)] shadow-xs border border-[var(--color-border)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Owner Admin & Rules</span>
              <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 text-[10px] font-mono">
                {bookingCount}
              </span>
            </button>

            <button
              onClick={() => handleTabChange("sms")}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "sms"
                  ? "bg-[var(--color-panel)] text-[var(--color-stripe-purple)] shadow-xs border border-[var(--color-border)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              <MessageSquareText className="h-3.5 w-3.5" />
              <span>Twilio SMS Feed</span>
            </button>
          </nav>

          {/* Right Controls: Theme Toggle & Reset */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onResetDemo}
              title="Reset to initial demo state"
              className="inline-flex items-center space-x-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center justify-between space-x-1 border-t border-[var(--color-border)] py-2 text-xs overflow-x-auto">
          <button
            onClick={() => handleTabChange("booking")}
            className={`px-3 py-1 rounded-md shrink-0 ${activeTab === "booking" ? "bg-[var(--color-stripe-purple)] text-white font-bold" : "text-[var(--color-text-muted)]"}`}
          >
            Wizard
          </button>
          <button
            onClick={() => handleTabChange("assistant")}
            className={`px-3 py-1 rounded-md shrink-0 ${activeTab === "assistant" ? "bg-[var(--color-stripe-purple)] text-white font-bold" : "text-[var(--color-text-muted)]"}`}
          >
            AI Chat
          </button>
          <button
            onClick={() => handleTabChange("admin")}
            className={`px-3 py-1 rounded-md shrink-0 ${activeTab === "admin" ? "bg-[var(--color-stripe-purple)] text-white font-bold" : "text-[var(--color-text-muted)]"}`}
          >
            Rules & Dispatch
          </button>
          <button
            onClick={() => handleTabChange("sms")}
            className={`px-3 py-1 rounded-md shrink-0 ${activeTab === "sms" ? "bg-[var(--color-stripe-purple)] text-white font-bold" : "text-[var(--color-text-muted)]"}`}
          >
            Twilio SMS
          </button>
        </div>
      </div>
    </header>
  );
}
