import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

pdf_path = "/Users/shakil/Apps/claude-code/nassau-clean-ai/docs/ESTIMATE.pdf"
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    rightMargin=36,
    leftMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Colors matching Stripe clean design
stripe_purple = colors.HexColor("#635bff")
dark_slate = colors.HexColor("#0a2540")
text_muted = colors.HexColor("#4f5b66")
bg_light = colors.HexColor("#f8fafc")
border_color = colors.HexColor("#e2e8f0")
emerald_green = colors.HexColor("#059669")

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Heading1'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=dark_slate,
    spaceAfter=4
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=stripe_purple,
    spaceAfter=10
)

meta_style = ParagraphStyle(
    'MetaText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=11,
    textColor=text_muted
)

meta_bold = ParagraphStyle(
    'MetaBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=11,
    textColor=dark_slate
)

section_heading = ParagraphStyle(
    'SectionHeading',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=15,
    textColor=dark_slate,
    spaceBefore=8,
    spaceAfter=4
)

body_style = ParagraphStyle(
    'BodyDark',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=11.5,
    textColor=dark_slate
)

table_header_style = ParagraphStyle(
    'TableHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=colors.white
)

table_cell_style = ParagraphStyle(
    'TableCell',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=7.5,
    leading=10.5,
    textColor=dark_slate
)

table_cell_bold = ParagraphStyle(
    'TableCellBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=7.5,
    leading=10.5,
    textColor=dark_slate
)

table_cell_green = ParagraphStyle(
    'TableCellGreen',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=7.5,
    leading=10.5,
    textColor=emerald_green
)

elements = []

# Title & Subtitle
elements.append(Paragraph("AI Booking & Dispatch System — Project Scope & Estimate", title_style))
elements.append(Paragraph("Residential Cleaning in Nassau County, NY • Architecture, Phases & Pricing", subtitle_style))

# Metadata block
meta_data = [
    [
        Paragraph("<b>Client:</b> Residential Cleaning Company (Massapequa, NY)", meta_style),
        Paragraph("<b>Consultant:</b> Shakil Ahmed · BarakahSoft LLC", meta_style),
    ],
    [
        Paragraph("<b>Target Budget:</b> $3,000 Fixed-Price", meta_style),
        Paragraph("<b>Total Turnkey Bid:</b> <b>$2,850.00</b> (19 Hours)", meta_style),
    ],
    [
        Paragraph("<b>Delivery Timeline:</b> 10 Business Days", meta_style),
        Paragraph("<b>Live Demo:</b> <font color='#635bff'>https://nassau-clean-ai.vercel.app</font>", meta_style),
    ]
]
t_meta = Table(meta_data, colWidths=[270, 270])
t_meta.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), bg_light),
    ('PADDING', (0,0), (-1,-1), 5),
    ('BOX', (0,0), (-1,-1), 0.5, border_color),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
elements.append(t_meta)
elements.append(Spacer(1, 8))

# Core Architectural Pillars
elements.append(Paragraph("Architectural Guarantees (Solving Your Key Requirements)", section_heading))
arch_text = (
    "<b>1. Zero Hallucination Risk:</b> The AI concierge is connected directly to your mathematical costbook via OpenAI structured function calling. It is physically incapable of inventing arbitrary dollar figures or phantom time slots.<br/>"
    "<b>2. Zero Developer Dependency:</b> You control rates, bedroom/bathroom prices, condition multipliers (+25% heavy, +50% extreme), and travel buffers directly from an intuitive owner admin panel without modifying code.<br/>"
    "<b>3. Multi-Crew Routing & 45-Min Buffers:</b> South Shore & North Shore crew allocation with automatic arrival buffer padding to eliminate double-booking.<br/>"
    "<b>4. Stripe Split-Deposit & Twilio Work Orders:</b> 25% deposit hold at checkout with automated SMS alerts to homeowners, crew leads, and 24-hour reminder triggers."
)
elements.append(Paragraph(arch_text, body_style))
elements.append(Spacer(1, 8))

# Scope of Work Table
elements.append(Paragraph("Phased Engineering Implementation Schedule", section_heading))

table_data = [
    [
        Paragraph("Phase", table_header_style),
        Paragraph("Deliverables & Technical Scope", table_header_style),
        Paragraph("Hours", table_header_style),
        Paragraph("Rate", table_header_style),
        Paragraph("Investment", table_header_style)
    ],
    [
        Paragraph("<b>Phase 0</b>", table_cell_bold),
        Paragraph("<b>Interactive Prototype & Proof-of-Concept</b><br/>Next.js 15 app on Vercel, deterministic pricing engine, grounded AI chat with 1-click wizard pre-fill, owner rule sliders, Twilio SMS visual phone feeds.", table_cell_style),
        Paragraph("40 hrs", table_cell_style),
        Paragraph("$0/hr", table_cell_style),
        Paragraph("<b>$0.00 (Delivered)</b>", table_cell_green)
    ],
    [
        Paragraph("<b>Phase 1</b>", table_cell_bold),
        Paragraph("<b>Supabase Production Persistence & RLS</b><br/>PostgreSQL schemas for costbooks, bookings, crew teams, and customers. Row Level Security policies to protect customer data and property access codes.", table_cell_style),
        Paragraph("4 hrs", table_cell_style),
        Paragraph("$150/hr", table_cell_style),
        Paragraph("$600.00", table_cell_style)
    ],
    [
        Paragraph("<b>Phase 2</b>", table_cell_bold),
        Paragraph("<b>Stripe Production Payment Processing</b><br/>Stripe Elements checkout, 25% deposit capture with 75% remaining balance authorization hold, and webhook triggers upon cleaning completion.", table_cell_style),
        Paragraph("4 hrs", table_cell_style),
        Paragraph("$150/hr", table_cell_style),
        Paragraph("$600.00", table_cell_style)
    ],
    [
        Paragraph("<b>Phase 3</b>", table_cell_bold),
        Paragraph("<b>Twilio Messaging & Inngest Reminders</b><br/>Production Twilio SMS dispatch for booking confirmations, crew work orders with entry codes, and Inngest automated 24-hour pre-clean reminders.", table_cell_style),
        Paragraph("5 hrs", table_cell_style),
        Paragraph("$150/hr", table_cell_style),
        Paragraph("$750.00", table_cell_style)
    ],
    [
        Paragraph("<b>Phase 4</b>", table_cell_bold),
        Paragraph("<b>Google Calendar 2-Way Sync & Buffers</b><br/>Calendar synchronization for South/North Shore crews, 45-minute travel buffers, daily job limits, and mobile responsive admin dashboard.", table_cell_style),
        Paragraph("4 hrs", table_cell_style),
        Paragraph("$150/hr", table_cell_style),
        Paragraph("$600.00", table_cell_style)
    ],
    [
        Paragraph("<b>Phase 5</b>", table_cell_bold),
        Paragraph("<b>End-to-End QA, Domain Setup & Warranty</b><br/>Sandbox edge-case testing, custom domain linking (book.yourcleaningdomain.com), owner video walkthrough, and 30-day comprehensive bug-fix warranty.", table_cell_style),
        Paragraph("2 hrs", table_cell_style),
        Paragraph("$150/hr", table_cell_style),
        Paragraph("$300.00", table_cell_style)
    ],
    [
        Paragraph("<b>TOTAL</b>", table_header_style),
        Paragraph("<b>Complete Turnkey Production System (Fits $3k Budget)</b>", table_header_style),
        Paragraph("<b>19 hrs</b>", table_header_style),
        Paragraph("-", table_header_style),
        Paragraph("<b>$2,850.00</b>", table_header_style)
    ]
]

t_table = Table(table_data, colWidths=[50, 305, 45, 50, 90])
t_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), dark_slate),
    ('ALIGN', (2,0), (-1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('GRID', (0,0), (-1,-1), 0.5, border_color),
    ('PADDING', (0,0), (-1,-1), 3.5),
    ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#f0fdf4")),
    ('BACKGROUND', (0,-1), (-1,-1), stripe_purple),
]))
elements.append(t_table)
elements.append(Spacer(1, 8))

# Monthly Infrastructure Costs
elements.append(Paragraph("Estimated Monthly Infrastructure Costs (Direct to Providers)", section_heading))
saas_data = [
    [Paragraph("<b>Provider</b>", meta_bold), Paragraph("<b>Role in Architecture</b>", meta_bold), Paragraph("<b>Estimated Monthly Cost</b>", meta_bold)],
    [Paragraph("Vercel", meta_style), Paragraph("Next.js 15 App Hosting & Edge Compute", meta_style), Paragraph("$0 (Hobby) or $20/mo (Pro)", meta_style)],
    [Paragraph("Supabase", meta_style), Paragraph("Managed PostgreSQL & Real-Time Sync", meta_style), Paragraph("$0/mo (Free tier covers 50k MAU)", meta_style)],
    [Paragraph("OpenAI API", meta_style), Paragraph("GPT-4o-mini Grounded Tool Calling", meta_style), Paragraph("~$2 - $5 / mo ($0.0003/query)", meta_style)],
    [Paragraph("Twilio", meta_style), Paragraph("Automated Customer & Team SMS Alerts", meta_style), Paragraph("~$10 - $20 / mo ($0.0079/SMS)", meta_style)],
    [Paragraph("Stripe", meta_style), Paragraph("Credit Card Deposit & Balance Processing", meta_style), Paragraph("2.9% + 30¢ per transaction", meta_style)],
    [Paragraph("<b>Total Stack</b>", meta_bold), Paragraph("<b>100% Client-Owned Accounts & Direct Billing</b>", meta_bold), Paragraph("<b>~$12 - $45 / month</b>", meta_bold)]
]
t_saas = Table(saas_data, colWidths=[85, 320, 135])
t_saas.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), bg_light),
    ('GRID', (0,0), (-1,-1), 0.5, border_color),
    ('PADDING', (0,0), (-1,-1), 3.5),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
elements.append(t_saas)

doc.build(elements)
print(f"Successfully generated {pdf_path}")
