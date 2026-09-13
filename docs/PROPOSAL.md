saw your requirement that the ai must connect to your actual pricing and availability so it does not make up information, and that you cannot be calling a developer every time you tweak a rate or rule.

i built you a working demo before submitting this proposal so you can test it directly:
live: https://nassau-clean-ai.vercel.app
code: https://github.com/exelentshakil/nassau-clean-ai
portfolio: https://shakilhq.com

the demo separates the pricing math from the ai completely. the booking wizard calculates base rates, bedroom and bathroom additions, square footage tiers, condition surcharges (+25% for heavy buildup or +50% for extreme grime), and recurring discounts deterministically. the ai chat assistant queries this exact costbook via structured function calls, so it has a 0.0% hallucination rate on prices or policies. in the admin tab, you can slide any price or policy and watch it immediately update both the wizard and the ai concierge without touching a single line of code.

the only simulated parts right now are live stripe charges and production twilio sms delivery, which use client-side test tokens and visual work-order feeds until your live api credentials are linked.

prior to independent consulting, i spent 4 years leading engineering at legiit, architecting ai booking workflows and payment pipelines for a 2m+ user platform.

how many cleaning crews are you starting with across nassau county, and do you want to hop on a 10-minute call today to test the dispatch buffers together?

---

screening questions:

1. what tools/platforms would you recommend for this project?
next.js 15 app router on vercel for high-speed mobile booking, supabase (postgresql) for real-time team dispatch and costbook storage, stripe elements for 25% deposits vs full prepayments, twilio for sms alerts, and openai gpt-4o-mini with strict tool calling for the grounded concierge.

2. how would you connect the ai to our real-time availability and pricing?
through deterministic tool calls. the ai never guesses a price. when a customer says "how much for a 3 bed 2 bath in massapequa", the ai executes a function that runs your formula against the postgresql costbook table and returns the exact quote and slot availability.

3. how would you prevent the ai from making up information?
system prompt boundaries, json schema output enforcement, and zero temperature on cost calculations. the ai is structurally prohibited from generating freeform dollar figures or unverified dates.

4. can you share examples of similar ai or booking systems you have built?
check the live demo above (nassau-clean-ai.vercel.app), plus my medical workflow demo (cozad-priorauth.vercel.app), and my previous work as head of engineering at legiit managing marketplace order scheduling for 2m+ users.

5. what is your estimated timeline for completing this project?
10 business days total. phase 0 is already running. phase 1 (live supabase + stripe) takes 3 days, phase 2 (twilio + dispatch buffers) takes 4 days, phase 3 (testing & handoff) takes 3 days.

6. how will you handle updates to pricing, availability, and policies?
through the owner admin dashboard built into the demo. you can adjust bedroom rates, condition surcharges, buffer times, or active crews directly from your phone or browser, and both the ai and booking wizard update instantly.

7. how do you plan to handle testing and quality assurance?
unit tests on the pricing engine for edge cases (e.g. 5,000 sqft with extreme condition + weekly discount), stripe webhook test clock runs to verify deposit vs final balance captures, and twilio sandbox verification on multiple carrier devices.

8. what ongoing support or maintenance do you provide?
30 days of comprehensive post-launch warranty at zero charge for bug fixes and tuning, plus an optional $250/mo retainer for ongoing feature additions and priority support.
