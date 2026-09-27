# Style4P — Personal Digital Closet & Outfit Discovery Platform

> **“Same old Closet, New Outfit”**  
> **Core Concept:** OWN → EXPLORE → REMIX → WEAR MORE

---

## 🌟 Overview

**Style4P** is a modern, high-fashion web platform designed to solve a universal wardrobe problem: having a closet full of clothes but always wearing the exact same combinations. Instead of pushing users to buy more items, Style4P unlocks hidden combinations from the clothes they already own through rule-based compatibility scoring, one-click item remixing, neglected item resurrection, and wear analytics.

---

## 📦 Deliverables Summary

This repository contains the complete specification, design system, interactive web application, API specifications, and database schema:

1. **Interactive Web Application (`index.html`, `styles.css`, `app.js`, `matching-engine.js`, `seed-data.js`)**:
   - Zero-dependency, ultra-fast client-side application running in any browser.
   - Built-in reactive mock engine with persistent localStorage and rich preloaded seed data.
   - **Views Included**:
     - 🏠 **Home / Dashboard**: Personalized editorial greeting, quick closet statistics, Forgotten Item spotlight, and recent outfit shelf.
     - 🚪 **Digital Closet**: Full inventory with search, multi-filter (Category, Style, Color, Season), wear counts, and Outfit Potential combination indicators.
     - 🪄 **Outfit Discovery**: Real-time rule-based matching engine (Color 30%, Style 25%, Category 20%, Occasion 15%, Weather 10%), animated match score gauge, detailed breakdown panel, and interactive controls (`Skip`, `Remix`, `I Wore This`, `Like`).
     - 🔀 **Outfit Remix (Remix Studio)**: Slot-based item replacer that recalculates match scores live when alternative pieces are clicked.
     - 🕰️ **Forgotten Items**: Automated tracking of dormant items (>25 days or low wears) with one-click "Try This Item" seeding.
     - 📅 **Wear History**: Chronological log of worn outfits and occasions.
     - 📊 **Closet Analytics**: Wardrobe utilization rate gauge, Most Worn piece, Least Worn piece, Category composition bars, and Color spectrum palette.
     - ➕ **Add/Edit Clothing Item Modal**: Form with 1-click test apparel presets.
     - 👤 **Account / User Switcher**: Profile management and one-click database reset to initial curated seed data.

2. **Design System (`styles.css` & `docs/DESIGN_SYSTEM.md`)**:
   - Curated color tokens (Deep Obsidian, Hyper Coral, Cyber Lime, Warm Linen).
   - Modern typography: `Outfit` (Headings), `Plus Jakarta Sans` (Body), `JetBrains Mono` (Metrics).
   - Glassmorphism, smooth micro-interactions, responsive mobile/tablet layout, dark & light theme toggle.

3. **Database Architecture & ORM (`prisma/schema.prisma`)**:
   - Production-ready PostgreSQL schema with Prisma ORM.
   - Relational models: `User`, `ClothingItem`, `Outfit`, `OutfitItem`, `WearLog`, `OutfitFeedback`.
   - Complete enums, cascade deletes, and performance indices.

4. **Realistic Seed Data (`seed-data.js` & `prisma/seed.ts`)**:
   - 20+ realistic fashion pieces with high-res Unsplash apparel photography.
   - Pre-generated outfits, verified wear history, and feedback records for user "Alex Morgan".

5. **API Specification (`docs/API_SPECIFICATION.md`)**:
   - Complete RESTful API specification covering Auth, Clothing, Outfits, Discovery, Remix, Feedback, Wear Logs, and Analytics.

---

## 🚀 How to Run the Application

### Option A: Open Directly in Browser (Zero Setup)
Simply open [`index.html`](./index.html) in any modern web browser:
- Double click `index.html` or open with Google Chrome / Edge / Firefox / Safari.
- All styles, images, matching engine calculations, and local storage state will work instantly!

### Option B: Local Static Server
If using VS Code or Node.js:
```bash
# Using Python built-in server:
python -m http.server 3000

# Or using npx serve:
npx serve .
```
Navigate to `http://localhost:3000`.

### Option C: PostgreSQL + Prisma (Backend Integration)
```bash
# 1. Install dependencies
npm install @prisma/client typescript ts-node @types/node

# 2. Set environment variable in .env
# DATABASE_URL="postgresql://user:password@localhost:5432/style4p_db?schema=public"

# 3. Run Prisma migration
npx prisma migrate dev --name init

# 4. Seed the database
npx ts-node prisma/seed.ts
```

---

## 🧠 Matching Engine Scoring Architecture

The Match Score is calculated using the following deterministic formula:

$$\text{Match Score} = (0.30 \times \text{Color}) + (0.25 \times \text{Style}) + (0.20 \times \text{Category}) + (0.15 \times \text{Occasion}) + (0.10 \times \text{Weather})$$

- **Color Compatibility (30%)**: Pairwise color harmony matrix (Neutrals pair universally, complementary tones score high).
- **Style Compatibility (25%)**: Style affinity matrix with dynamic boosts from user feedback (Liked styles receive weight bonuses).
- **Category Compatibility (20%)**: Structural completeness check (requires Top + Bottom + Shoes, bonuses for Outerwear/Accessories).
- **Occasion Fit (15%)**: Suitability score for selected occasion (Casual, Cafe, University, Party, Formal, Sport).
- **Weather Suitability (10%)**: Fabric and layering penalties/bonuses based on temperature (Hot, Warm, Rainy, Cold).

---

## 📁 Repository Directory Structure

```text
Style4P/
├── index.html               # Main semantic HTML5 single-page application
├── styles.css               # Complete Design System and CSS tokens
├── app.js                   # Application state manager and UI controller
├── matching-engine.js       # Rule-based Discovery & Remix scoring engine
├── seed-data.js             # Realistic wardrobe seed dataset
├── prisma/
│   ├── schema.prisma        # PostgreSQL Prisma database schema
│   └── seed.ts              # TypeScript database seeder script
├── docs/
│   ├── API_SPECIFICATION.md # RESTful OpenAPI specification
│   └── DESIGN_SYSTEM.md     # Design System documentation & tokens
└── README.md                # Project documentation & run guide
```

---

## 🎯 Success Criteria Validation

| Feature | Status | Verification |
| :--- | :---: | :--- |
| **Authentication Flow** | ✅ Complete | Profile modal, session info, local reset |
| **Add Clothing Item** | ✅ Complete | Modal with 1-click test presets & image inputs |
| **Digital Closet** | ✅ Complete | Search, category tabs, filter by style/color/season |
| **Outfit Potential** | ✅ Complete | Dynamic calculation for every item in closet |
| **Outfit Discovery** | ✅ Complete | Context selectors (Occasion & Weather), candidate deck |
| **Match Score Breakdown** | ✅ Complete | Overall score + 5-factor breakdown progress bars |
| **Like / Skip Feedback** | ✅ Complete | Real-time preference weight learning |
| **Outfit Remix** | ✅ Complete | Slot swapper with real-time score recalculation |
| **Forgotten Items** | ✅ Complete | Dormancy counter (>25 days) + "TRY THIS ITEM" CTA |
| **Wear Tracking** | ✅ Complete | "I WORE THIS" logger updating item & outfit wears |
| **Closet Analytics** | ✅ Complete | Utilization ring, Most/Least worn, category & color charts |
