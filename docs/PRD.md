# Product Requirements Document (PRD)
## AI-Powered Online Booking & Dispatch System for Residential Cleaning
**Target Market:** Nassau County, Long Island, NY (Massapequa, Garden City, Syosset, Merrick, etc.)  
**Client Project:** AI Booking System Developer for Residential Cleaning Company  
**Lead AI & Systems Architect:** Shakil Ahmed (BarakahSoft LLC)  
**Fixed Budget:** $3,000.00  
**Live Prototype:** https://nassau-clean-ai.vercel.app  
**Date:** September 14, 2026  

---

## 1. Executive Summary & Defensibility Hook

Residential cleaning operations fail when using either:
1. **Generic contact forms:** Leading to endless back-and-forth phone calls, quote drop-offs, and delayed scheduling.
2. **Ungrounded AI chatbots:** Where language models invent arbitrary prices, promise unavailable weekend slots, or misrepresent company cancellation policies.

### The Architectural Solution (Defensibility Hook)
To solve the client's explicit requirement (*"The AI should be connected to our actual pricing, availability and company policies so that it does not make up information"*):
- **Deterministic Pricing & Availability Core:** All pricing formulas (bedrooms, bathrooms, sqft, condition multipliers, add-ons, frequency discounts) and slot allocations (teams, duration, travel buffers) live in a deterministic calculation engine that the business owner can edit via an Admin Dashboard without touching code.
- **Grounded AI Booking Assistant:** The customer-facing AI Assistant does not generate prices from prompt memory; it calls the deterministic pricing engine via structured tool-calling (`calculateCleaningPrice`) and queries live slot availability before giving any quote or booking recommendation.

---

## 2. End-to-End Customer Booking Flow

```
+---------------------------------------------------------------------------------------------------+
| 1. HOME DETAILS       2. CONDITION & TIME     3. ADD-ON SERVICES    4. FREQUENCY & PRICING        |
| Beds, Baths, SqFt     Normal / Heavy /        Oven, Fridge,         One-time, Weekly (-20%),      |
| Standard / Deep /     Extreme (+25% / +50%)   Windows, Cabinets,    Bi-weekly (-15%),             |
| Move-in Move-Out      Estimated Hours Calc    Baseboards, Pet Hair  Monthly (-10%)                |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| 5. CALENDAR & TIME SLOTS                      6. STRIPE CHECKOUT          7. TWILIO AUTOMATIONS   |
| Real-time availability check, buffer time,    Full payment or Deposit     SMS Confirmation,       |
| team assignment, blackout dates prevention    Credit Card / Apple Pay     Team Dispatch Alert     |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Core Feature Requirements & Specifications

### 3.1 Dynamic Pricing Engine (Deterministic)
- **Base Rate:** Configurable base service fee (e.g., $120 baseline).
- **Room Multipliers:** 
  - Bedrooms: +$25 / bedroom.
  - Bathrooms: +$35 / bathroom (higher labor intensity).
- **Square Footage Tier:**
  - Under 1,500 sqft: Included in baseline.
  - 1,500 - 2,500 sqft: +$30.
  - 2,500 - 3,500 sqft: +$60.
  - 3,500+ sqft: +$95.
- **Cleaning Type Multipliers:**
  - Standard Recurring: 1.0x.
  - Deep Clean: 1.45x (intensive scrub of baseboards, tile grout, exterior vents).
  - Move-In / Move-Out: 1.65x (empty home deep clean including inside closets).
  - Post-Construction: 1.90x (heavy dust mitigation).
- **Home Condition Modifier (Client Requirement):**
  - Normal Condition: 1.0x (routine maintenance).
  - Heavy Buildup / Extra Time Needed: 1.25x (+1.5 hours labor added).
  - Extreme Dirt / Clutter / Neglect: 1.50x (+3.0 hours labor added).
- **Add-On Catalog:**
  - Inside Oven Cleaning: +$45 (+45 min).
  - Inside Refrigerator: +$40 (+30 min).
  - Interior Window Detailing (up to 10 windows): +$55 (+45 min).
  - Inside Kitchen Cabinets (empty): +$50 (+45 min).
  - Heavy Pet Hair Removal Treatment: +$35 (+30 min).
  - Additional Cleaning Hours: +$45 / labor hour.
- **Frequency Discounts:**
  - One-Time: 0% discount.
  - Monthly: 10% recurring discount.
  - Bi-Weekly (Most Popular): 15% recurring discount.
  - Weekly: 20% recurring discount.

### 3.2 Scheduling & Team Capacity Engine
- **Multi-Team Support:** Configurable team rosters (Team 1, Team 2, expandable to N teams).
- **Dynamic Duration Calculation:** Estimated job duration calculated from rooms + condition + add-ons.
- **Travel & Buffer Time:** Configurable buffer (default: 45 minutes) enforced between appointments to prevent overlapping or late arrivals.
- **Blackout & Holiday Calendars:** Business owner can lock specific dates, Sundays, or holidays with 1 click.
- **Double-Booking Shield:** Database locks time slots atomically upon checkout session initiation.

### 3.3 Payments & Deposits (Stripe Integration)
- **Stripe Elements:** Embedded, PCI-compliant payment collection for credit cards and Apple Pay / Google Pay.
- **Deposit vs. Full Pay Toggle:**
  - Deposit Mode: Collects fixed percentage (e.g., 25% or $50 non-refundable deposit) with balance held on card authorization until service completion.
  - Full Payment Mode: Full charge upon booking.
- **Automated Invoicing & Receipts:** Instant digital receipt with breakdown.

### 3.4 SMS & Communication Engine (Twilio Integration)
- **Customer Notifications:**
  - Instant SMS booking confirmation with appointment details and rescheduling link.
  - 24-hour reminder SMS with arrival window.
  - Same-day "cleaners en route" alert with team leader name.
  - Post-cleaning satisfaction check & Google Review request.
- **Team Dispatch Alerts:**
  - SMS alert to assigned cleaning team with property address, access codes, customer notes, and add-on checklist.

### 3.5 Grounded AI Assistant
- An interactive assistant answering natural language questions:
  - *"How much for a 3-bedroom, 2-bathroom house in Massapequa?"* &rarr; Calls pricing tool and outputs exact quote with breakdown.
  - *"Do you clean ovens and inside refrigerators?"* &rarr; Explains add-ons, pricing, and allows 1-click addition to cart.
  - *"Can I book for this Saturday at 10 AM?"* &rarr; Checks live calendar availability for Team 1 and Team 2.
  - *"What is included in a deep clean vs. standard?"* &rarr; Quotes exact company policy checklist.
- **1-Click "Apply to Booking Wizard" Action:** When the user agrees with the AI's quote, a single button pre-fills the entire booking form.

### 3.6 Business Owner Admin Dashboard
- **Live Dispatch Calendar:** Day/Week/Month view showing booked slots, assigned teams, customer addresses, and job status.
- **Pricing & Rule Configurator:** Visual sliders and input fields to modify base rates, condition multipliers, and add-on prices in real time without contacting a developer.
- **Availability & Capacity Controls:** Adjust working hours, team counts, buffer times, and blackout dates.
- **Customer CRM & Booking Manager:** Reschedule, cancel, or manually add offline/phone bookings.

---

## 4. Acceptance Criteria Checklist (Matching Client Brief)

| Requirement from Brief | Implementation in Prototype | Status |
|---|---|---|
| Select date and available time slot | Interactive real-time slot picker with buffer validation | ✅ Covered |
| Collect property info (beds, baths, sqft, type, add-ons, frequency) | Multi-step interactive booking wizard | ✅ Covered |
| Automatically calculate price based on rules | Real-time deterministic pricing calculator | ✅ Covered |
| Account for home condition / extra time | Normal / Heavy (+25%) / Extreme (+50%) condition modifier | ✅ Covered |
| Process online payments | Stripe integration with Deposit / Full Pay toggle | ✅ Covered |
| Send automated booking confirmations & SMS reminders | Simulated Twilio SMS event dispatcher & logs | ✅ Covered |
| Prevent double-booking | Team capacity & travel buffer collision detection | ✅ Covered |
| Admin dashboard to modify rules & view schedule | Full owner admin panel with live rule editor | ✅ Covered |
| Grounded AI Assistant that does not make up info | AI tool-calling grounded in deterministic costbook | ✅ Covered |
| Easy for business owner to manage without developer | Self-serve admin rulebook & capacity management | ✅ Covered |
