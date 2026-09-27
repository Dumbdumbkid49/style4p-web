# Style4P — Design System & Editorial Visual Language

> **Product Design Directive:** Modern • Fashion • Minimal • Clean • High-End Editorial  
> **Philosophy:** *"You don't need more clothes. You need more ways to wear them."*

---

## 1. Design Principles

1. **Editorial Fashion First, Dashboard Second:**
   - Avoid sterile enterprise table interfaces.
   - Large apparel photography, generous breathing room, high typographic contrast.
   - Give clothes tactile presence and respect their aesthetic value.

2. **Action-Oriented Discovery:**
   - Outfit creation is effortless: Discover → Like/Skip → Remix → Wear.
   - Interactive feedback loops make closet rotation addictive and rewarding.

3. **Restraint with High-Voltage Accents:**
   - Dark Obsidian (`#0A0B0E`) background base.
   - Strategic highlights: Hyper Coral (`#FF5E3A`) for bold streetwear energy, Cyber Lime (`#C8F560`) for active states and discovery scores.

---

## 2. Color Palette & Tokens

### Base & Surfaces
| Token | Value | Role |
| :--- | :--- | :--- |
| `--bg-main` | `#0A0B0E` | Main application background (Deep Obsidian) |
| `--bg-card` | `#12141A` | Primary card surface |
| `--bg-card-elevated` | `#181B24` | Elevated dialogs, toolbars, and inputs |
| `--bg-card-hover` | `#1F2330` | Hover interactive feedback |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Structural dividers and card outlines |
| `--border-medium` | `rgba(255, 255, 255, 0.16)` | Active card borders and focus rings |

### Editorial Accents
| Token | Value | Role |
| :--- | :--- | :--- |
| `--accent-primary` | `#FF5E3A` | Hyper Coral: Primary CTAs, favorites, heart badges |
| `--accent-secondary` | `#C8F560` | Cyber Lime: High match scores, remix actions, verification |
| `--accent-warm` | `#E6D5C3` | Warm Linen: Forgotten item highlights and neutral chips |
| `--accent-success` | `#10B981` | Emerald: Verified wears and 90%+ match indicators |
| `--accent-danger` | `#F43F5E` | Rose: Deletions, dormant item alerts |

---

## 3. Typography Architecture

### Font Families
- **Display / Headings:** `Outfit` (Google Fonts, geometric, contemporary luxury)
- **Body / Labels:** `Plus Jakarta Sans` (Google Fonts, clean humanist grotesque)
- **Data / Metrics / Codes:** `JetBrains Mono` (Google Fonts, high legibility for scores & counts)

### Scale & Hierarchy
- `Hero Title`: `3.2rem` (`51px`), Weight 800, Letter spacing `-0.04em`
- `Section Title`: `2.2rem` (`35px`), Weight 800, Letter spacing `-0.03em`
- `Card Heading`: `1.25rem` (`20px`), Weight 700
- `Body Text`: `0.95rem` (`15px`), Line height `1.5`, Weight 400
- `Tag / Micro`: `0.72rem` (`11.5px`), Uppercase, Monospace, Letter spacing `0.08em`

---

## 4. Components

### 4.1 Outfit Stage Card
- Elevated card with ambient inner glow.
- Visual gallery displaying constituent items in harmony.
- Circular Match Score badge with radial gradient and hover scale.
- Bottom action dock with Skip, Remix, I Wore This, and Like controls.

### 4.2 Remix Slot Swapper
- Slot card with dashed state for unselected, glowing Cyber Lime border for active slot.
- Real-time compatibility recalculation when alternative pieces are clicked.

### 4.3 Forgotten Item Revive Card
- High contrast "Dormant [X] Days" badge.
- Direct "TRY THIS ITEM" one-click action that seeds the discovery engine.

---

## 5. Micro-Animations & Timing
- Card hover lift: `transform: translateY(-4px)`, cubic-bezier(0.16, 1, 0.3, 1) 0.3s.
- Match gauge animation: Radial stroke-dashoffset transition 0.8s ease.
- Like heart burst: `transform: scale(1.08)`, subtle glow box-shadow.
