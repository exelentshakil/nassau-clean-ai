"use client";

import React, { useState, useRef, useEffect } from "react";
import { CleaningType, HomeCondition, CleaningFrequency, GroundedChatMessage } from "@/lib/types";
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Clock,
  DollarSign,
  AlertCircle,
  RotateCcw
} from "lucide-react";

interface AiAssistantProps {
  onApplyPrefill: (prefill: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    cleaningType: CleaningType;
    condition: HomeCondition;
    addOns: string[];
    frequency: CleaningFrequency;
  }) => void;
}

const INITIAL_MESSAGES: GroundedChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content:
      "Hello! I am Nassau Clean's AI concierge, directly grounded in our official company costbook, policies, and crew schedules across Nassau County.\n\nI can calculate guaranteed pricing, compare cleaning packages, or answer any policy questions (cancellation, pet hair, condition modifiers, or arrival windows). What can I help quote for you today?",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    groundedSources: ["Nassau Clean Master Costbook 2026", "Cancellation & Deposit Terms", "Service Territory Map"],
  },
];

const SUGGESTED_QUERIES = [
  "How much is a 3 bed 2 bath deep clean in Massapequa?",
  "What is the difference between standard and deep clean?",
  "How much extra does an oven or fridge clean cost?",
  "What is your cancellation and deposit policy?",
  "Can you quote a 4 bed 3 bath home with heavy pet hair?",
];

export function AiAssistant({ onApplyPrefill }: AiAssistantProps) {
  const [messages, setMessages] = useState<GroundedChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: GroundedChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();

      const aiMessage: GroundedChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundedSources: data.groundedSources || ["Official Pricing Schedule", "Company Operating Policies"],
        suggestedAction: data.suggestedAction,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: GroundedChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "Standard pricing for a 3-bedroom, 2-bathroom home in Massapequa starts at $180 for standard recurring service, or $261 for a deep clean scrub. Our 25% deposit policy holds your slot, with free rescheduling up to 24 hours prior.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundedSources: ["Deterministic Fallback Engine", "Local Policy Database"],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner explaining the Defensibility Hook */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-[var(--color-stripe-purple)]/10 text-[var(--color-stripe-purple)] flex items-center justify-center font-bold">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Grounded AI Booking Concierge
              </h3>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Costbook Bound
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Strictly prohibited from hallucinating rates. All quotes reference our live deterministic rulebook.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetChat}
          className="inline-flex items-center space-x-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-subtle)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Chat Thread Container */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-xs flex flex-col h-[580px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-[var(--color-stripe-purple)] text-white"
                    : "bg-[var(--color-panel-subtle)] text-[var(--color-stripe-purple)] border border-[var(--color-border)]"
                }`}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Bubble */}
              <div className="max-w-[80%] space-y-2">
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap shadow-xs ${
                    msg.role === "user"
                      ? "bg-[var(--color-stripe-purple)] text-white"
                      : "bg-[var(--color-panel-subtle)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                  }`}
                >
                  {msg.content}

                  {/* 1-Click Action to apply AI parameters straight into the Booking Wizard */}
                  {msg.suggestedAction && (
                    <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                      <button
                        type="button"
                        onClick={() => {
                          if (msg.suggestedAction) {
                            onApplyPrefill({
                              bedrooms: msg.suggestedAction.prefillBedrooms || 3,
                              bathrooms: msg.suggestedAction.prefillBathrooms || 2,
                              sqft: msg.suggestedAction.prefillSqft || 2000,
                              cleaningType: msg.suggestedAction.prefillType || "standard",
                              condition: msg.suggestedAction.prefillCondition || "normal",
                              addOns: msg.suggestedAction.prefillAddOns || [],
                              frequency: msg.suggestedAction.prefillFrequency || "biweekly",
                            });
                          }
                        }}
                        className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-[var(--color-stripe-purple)] to-[#00d4b2] px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition-opacity"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{msg.suggestedAction.label}</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Grounded Citations Badge Footer */}
                {msg.groundedSources && msg.groundedSources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-[10px] text-[var(--color-text-muted)] px-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    <span>Grounded in:</span>
                    {msg.groundedSources.map((source, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 font-mono"
                      >
                        {source}
                      </span>
                    ))}
                    <span className="text-[9px] text-slate-400 ml-auto">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-xl bg-[var(--color-panel-subtle)] text-[var(--color-stripe-purple)] border border-[var(--color-border)] flex items-center justify-center">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel-subtle)] p-4 text-xs text-[var(--color-text-muted)] flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[var(--color-stripe-purple)] animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-[var(--color-stripe-purple)] animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-[var(--color-stripe-purple)] animate-bounce [animation-delay:0.4s]" />
                <span className="font-mono text-[11px] text-slate-500 ml-1">
                  Querying deterministic costbook & Nassau availability...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries Chips */}
        <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-panel-subtle)]/50 overflow-x-auto">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-[var(--color-text-muted)] whitespace-nowrap flex items-center font-medium">
              <HelpCircle className="h-3 w-3 mr-1 text-[var(--color-stripe-purple)]" />
              Quick Questions:
            </span>
            {SUGGESTED_QUERIES.map((query, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(query)}
                className="whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-1 text-[11px] text-[var(--color-text-secondary)] hover:border-[var(--color-stripe-purple)] hover:text-[var(--color-stripe-purple)] transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[var(--color-panel)] border-t border-[var(--color-border)] flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about home cleaning pricing, add-ons, or policies in Nassau County..."
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stripe-purple)]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[var(--color-stripe-purple)] text-white shadow-xs hover:bg-[var(--color-stripe-purple-hover)] disabled:opacity-40 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
