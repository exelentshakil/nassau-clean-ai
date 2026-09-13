# Turnkey Engineering Estimate & Scope of Work
## AI Booking System for Residential Cleaning in Nassau County, NY
**Client:** Residential Cleaning Company (Massapequa, NY / Nassau County)  
**Contractor:** Shakil Ahmed · BarakahSoft LLC · exelentshakil  
**Standard Consulting Rate:** $150 / hr  
**Fixed-Price Total:** $2,850 (19 Engineering Hours) — *Within Client's $3,000 Budget*  
**Turnaround Time:** 10 Business Days to Launch  
**Live Proof of Concept:** [https://nassau-clean-ai.vercel.app](https://nassau-clean-ai.vercel.app)  

---

### Executive Summary

To guarantee that your AI booking system never hallucinates prices, invents phantom time slots, or quotes inaccurate policies, our architecture enforces a strict structural separation:
1. **Deterministic Pricing Engine:** Mathematical calculation of base rates, bedrooms ($25/ea), bathrooms ($35/ea), square footage tiers, condition multipliers (Normal 1.0x, Heavy 1.25x / +1.5 hrs, Extreme 1.50x / +3.0 hrs), add-ons (Oven, Fridge, Windows, Cabinets, Baseboards, Pet Hair), and frequency discounts (Weekly -20%, Bi-weekly -15%, Monthly -10%).
2. **Grounded AI Concierge:** OpenAI GPT-4o-mini strictly bound to your costbook via tool calling. The AI cannot make up prices or availability; it executes verified functions against your database and provides 1-click wizard pre-fill actions.
3. **Owner Admin Dashboard:** Zero developer dependency. You can modify any rate, multiplier, buffer time, or team schedule directly from your browser or mobile phone, updating both the booking wizard and AI concierge instantly.
4. **Stripe & Twilio Automations:** 25% booking deposit vs full payment collection, immediate customer SMS confirmation, team dispatch work orders with entry codes, and 24-hour pre-clean automated reminders.

---

### Phase Breakdown

| Phase | Description | Hours | Rate | Total |
| :--- | :--- | :---: | :---: | :---: |
| **Phase 0** | **Working Interactive Prototype & Architecture Demo**<br>• Fully interactive multi-step booking wizard with live breakdown<br>• Grounded AI chat assistant with 1-click form pre-fill<br>• Owner admin dashboard with live rulebook sliders<br>• Multi-team dispatch engine with 45-min travel buffers<br>• Twilio SMS simulation feed & phone mockup | **40 hrs** | **$0** | **$0.00** *(Delivered Upfront)* |
| **Phase 1** | **Supabase Production Persistence & Security**<br>• PostgreSQL tables: `costbook_rules`, `bookings`, `teams`, `customers`<br>• Row Level Security (RLS) protecting customer PII and access codes<br>• Real-time synchronization of rule changes across all client sessions | **4 hrs** | $150/hr | $600.00 |
| **Phase 2** | **Stripe Production Payment Processing**<br>• Stripe Elements embedded checkout (PCI-DSS compliant)<br>• Split deposit workflow: 25% charged at booking, 75% balance hold<br>• Automated balance capture upon job completion webhook | **4 hrs** | $150/hr | $600.00 |
| **Phase 3** | **Twilio SMS Automations & Inngest 24h Reminders**<br>• Twilio Messaging API setup with toll-free / 10DLC registration<br>• Instant customer confirmation SMS with receipt link & arrival window<br>• Cleaning team dispatch SMS with lockbox/alarm codes & add-on checklist<br>• Inngest durable cron for automated 24-hour reminder SMS | **5 hrs** | $150/hr | $750.00 |
| **Phase 4** | **Google Calendar 2-Way Sync & Dispatch Buffers**<br>• Google Calendar OAuth2 integration for South Shore & North Shore crews<br>• Enforced 45-minute travel buffers and daily job caps (max 2/day)<br>• Atomic slot reservation preventing any double booking | **4 hrs** | $150/hr | $600.00 |
| **Phase 5** | **End-to-End Testing, Domain Launch & 30-Day Warranty**<br>• Comprehensive edge-case testing (heavy condition, multi-add-ons, discounts)<br>• Custom domain configuration (`book.yourcleaningdomain.com`)<br>• Full owner video walkthrough and 30-day bug-free warranty | **2 hrs** | $150/hr | $300.00 |
| **TOTAL** | **Full Turnkey Production System** | **19 hrs** | | **$2,850.00** |

---

### Monthly Running Infrastructure Costs (Paid Direct to Providers)

| Service | Purpose | Estimated Monthly Cost |
| :--- | :--- | :--- |
| **Vercel** | High-performance Next.js 15 hosting & edge compute | $0 (Hobby) or $20/mo (Pro) |
| **Supabase** | Managed PostgreSQL database & auth | $0/mo (Free tier covers up to 50k MAU) |
| **OpenAI API** | GPT-4o-mini grounded concierge queries | $2 - $5 / mo (~$0.0003 per quote) |
| **Twilio** | SMS booking confirmations & reminders | ~$10 - $20 / mo ($0.0079/SMS) |
| **Stripe** | Credit card processing | 2.9% + 30¢ per transaction |
| **Total** | **Estimated Ongoing SaaS Stack** | **~$12 – $45 / month** |

---

### Acceptance Criteria & Quality Checklist

- [x] **Zero Hallucinations:** AI queries costbook via tool-calling; cannot invent prices or phantom slots.
- [x] **Owner Autonomy:** Admin sliders update prices, add-on rates, and condition modifiers with zero code changes.
- [x] **Condition Modifiers:** Dedicated multipliers for Heavy Buildup (+25% / +1.5h) and Extreme Dirt (+50% / +3.0h).
- [x] **Stripe Deposit Mode:** Supports 25% deposit hold or 100% full prepayment.
- [x] **Multi-Team Dispatch:** South Shore and North Shore routing with 45-minute travel buffers.
- [x] **Twilio Event SMS:** Customer confirmation, crew work order dispatch, and 24h pre-service reminders.
- [x] **Mobile First:** Ultra-fast responsive interface designed for Nassau County homeowners on iPhone/Android.
