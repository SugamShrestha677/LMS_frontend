# Design System: Leapfrog Connect (Premium)

## 1. Visual Theme & Atmosphere
A clinical yet vibrant educational platform. The atmosphere is high-agency, professional, and trustworthy, with a distinct Nepal-inspired accent (Emerald Green). Density is balanced (6/10), variance is high (8/10) to avoid generic symmetry, and motion is fluid (7/10) using weighty spring physics.

## 2. Color Palette & Roles

### Light Mode (Default)
- **Canvas White** (#FBFBFD) — Primary background surface, off-white for reduced eye strain.
- **Pure Surface** (#FFFFFF) — Card and container fill.
- **Obsidian Ink** (#121217) — Primary text, deep depth.
- **Slate Metadata** (#64647D) — Secondary text, descriptions, timestamps.
- **Airy Border** (rgba(18,18,23,0.08)) — Subtle 1px structural lines.
- **Leapfrog Emerald** (#0A5C4A) — Primary accent for success, CTAs, and branding.
- **Amber Gold** (#F5A623) — Secondary accent for warnings, badges, and points.

### Dark Mode
- **Midnight Canvas** (#0B0B0F) — Primary dark background, deep obsidian with slight blue tint.
- **Elevated Surface** (#14141A) — Card and container fill for dark mode.
- **Ghost White** (#F5F5F7) — Primary text for high readability.
- **Muted Slate** (#9898B0) — Secondary text and metadata.
- **Crystal Border** (rgba(245,245,247,0.12)) — Sharper borders for dark mode depth.
- **Vibrant Emerald** (#10B981) — Brightened emerald for dark mode contrast.
- **Neon Amber** (#FBBF24) — Secondary accent for dark mode.

## 3. Typography Rules
- **Display:** Outfit — Track-tight, geometric, weight-driven hierarchy.
- **Body:** Outfit — Relaxed leading (1.6), 65ch max-width.
- **Mono:** Geist Mono — For metrics, stats, and metadata.
- **Banned:** Inter (too generic), pure black (#000000), neon purple glows.

## 4. Component Stylings
* **Buttons:** Tactile push feedback (-1px Y-translate on active). No outer glows. Radius: 1rem (16px).
* **Cards:** Generously rounded corners (1.25rem / 20px). Subtle shadow in light mode, border-only in dark mode.
* **Inputs:** Labels in Slate Metadata, borders in Airy/Crystal. 0.75rem padding.
* **Navigation:** Glassmorphism on Navbar (backdrop-filter: 16px). Sidebar uses consistent Midnight Canvas in all modes for stability.

## 5. Layout Principles
- **Asymmetric Grid:** Avoid 3-column equal card layouts; use 2:1 or staggered grids.
- **Whitespace:** Generous internal padding (p-6 or p-8) to let content breathe.
- **Responsive:** Strict single-column collapse below 768px. Touch targets min 44px.

## 6. Motion & Interaction
- **Spring Physics:** `stiffness: 100, damping: 20` for all Framer Motion components.
- **Micro-interactions:** Subtle float animations on cards, pulse on verified badges.
- **Transitions:** 300ms ease-in-out for theme switching.

## 7. Anti-Patterns (Banned)
- No Inter font.
- No pure black (#000000).
- No neon glows or purple accents.
- No 3-column equal card layouts.
- No generic placeholder names (use local context).
- No broken image links.
