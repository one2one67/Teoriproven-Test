# Teorigo Design Direction: "Cosmic Slate" Visual Identity & Style Guide

This document establishes the official design direction, visual guidelines, and design tokens for the **Teorigo** learning platform. These guidelines ensure a trustworthy, premium, high-credibility environment tailored for transport theory education in Norway, functioning flawlessly across all formats and multilingual states (including direct RTL support).

---

## 1. Vision & Art Direction

### Premium, Calm, and Credible
Teorigo is an educational resource of high professional importance. It must feel like an authoritative, high-integrity academy rather than a playful, over-gamified app or generic AI template. 

*   **Aesthetic**: **"Cosmic Slate"**—an understated, deep-toned, high-contrast, structured user interface.
*   **The Tone**: Precise, clean, modern, and serious.
*   **Design Values**:
    *   **Less is More**: Eliminate frivolous background decorative elements, erratic neon glows, and unrequested widgets.
    *   **Asymmetry over Centering**: Use deliberate, modern grid alignment. Never default to centering all blocks of text.
    *   **High Contrast & Legibility**: Strict adherence to accessible text-to-background contrast ratios. Focus must remain on learning content.

---

## 2. Palette (The "Cosmic Slate" Color Tokens)

To prevent color-clutter and establish a cohesive mood, the color palette is strictly limited to a narrow spectrum of deep slates and cold charcoal blues, balanced by clear informational accents.

| Role | Color Value (Hex) | Tailwind Utility Name | Visual Intent / Usage |
| :--- | :--- | :--- | :--- |
| **Deep Canvas** | `#080b11` | `--color-brand-dark` | Base background of the entire viewport. |
| **Surface (Primary)** | `#0e131f` | `--color-brand-dark-2` | Cards, navigation bars, and active interactive containers. |
| **Surface (Secondary)** | `#171e2e` | `bg-slate-900`/`bg-slate-800` | Nested modules, secondary panels, inactive states. |
| **Border (Low Intensity)**| `#1a2436` | `--color-brand-border` | Default container layout lines, input borders. |
| **Border (High Intensity)**| `#2e3f59` | `border-slate-700` | Focused elements, hovered borders, dividers. |
| **Primary Accent** | `#2563eb` (Blue 600) | `--color-brand-blue` | Active indicator flags, call-to-actions. |
| **Primary Accent Light** | `#60a5fa` (Blue 400) | `--color-brand-blue-lt` | Body links, high-value visual states, text highlights. |
| **Success State** | `#10b981` (Emerald 500) | `text-emerald-500` / `border-emerald-500` | Correct answers, verified codes, active entitlements. |
| **Error / Warning** | `#ef4444` (Red 500) | `text-red-500` / `border-red-500` | Expired access, invalid codes, failed selections. |

---

## 3. Typography & Pairings

We utilize a maximum of two elegant font families imported directly into the application stylesheet. This creates an obvious, beautiful hierarchy across all headings, cards, and UI components.

### Fonts
1.  **Display Font (Headings)**: **Outfit** (sans-serif)
    *   *Characteristics*: Warmly geometric, modern, and sturdy.
    *   *Usage*: Screen titles, main headers, hero banners, and key statistics or badge values.
2.  **UI & Body Font (Text)**: **Inter** (sans-serif)
    *   *Characteristics*: Highly readable, exceptional clarity at small sizes on screens, diverse weight distribution.
    *   *Usage*: Reading paragraphs, questions, multiple-choice items, state buttons, metadata labels, and form input values.

### Type Hierarchy Specifications
*   **Hero / Display Titles**: `font-display font-extrabold tracking-tight text-white mb-3 text-3xl md:text-4xl`
*   **Section Headers**: `font-display font-bold tracking-tight text-white/90 text-xl md:text-2xl`
*   **Card / Module Titles**: `font-display font-semibold text-white text-base md:text-lg`
*   **Body Paragraphs**: `font-sans text-slate-300 font-normal leading-relaxed text-sm md:text-base`
*   **Form Labels / Small Flags**: `font-sans font-bold text-slate-400 uppercase tracking-wider text-[10px] md:text-xs`
*   **Interactive / Button Controls**: `font-display font-bold tracking-tight text-white text-sm`

---

## 4. Spacing, Geometry & Borders

To look premium, layout components must align to a consistent relative grid. Standardized radii and spacing establish predictability across desktop and mobile form factors.

*   **View Padding & Margins**:
    *   *Mobile UI*: 16px (`p-4` or `px-4`) standard horizontal gutters.
    *   *Desktop UI*: 32px (`p-8` or `px-8` / `max-w-7xl mx-auto`) with strong vertical negative space (`py-12`).
*   **Grid Structure**:
    *   Multi-column components should leverage standard responsive grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`). No random elements floating out of bounds.
*   **Borders & Radii**:
    *   *Outer Containers / Hero Modules*: Responsive 20px - 24px (`rounded-2xl` or `rounded-3xl`).
    *   *Standard Cards / Inside Containers*: 16px (`rounded-xl` or `rounded-2xl`).
    *   *Buttons / Inputs / Interactive Badges*: 8px - 12px (`rounded-lg` or `rounded-xl`).
    *   *Border Width*: Solid `1px` or modern high-fidelity `1.5px` border lines.

---

## 5. UI System & Interactive States

Interactive components must communicate state shifts consistently (hover, focus, active, loading, disabled) through subtle styling cues rather than abrupt visual changes.

### 1. Form Inputs
*   **Default State**: Clean background, slim border, explicit placeholder color.
    ```css
    @apply bg-brand-dark/50 text-white border-[1.5px] border-brand-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:bg-brand-dark/80 transition-all font-sans;
    ```
*   **Focused State**: Indigo/blue boundary focus glow, background tint slightly lighter to represent active engagement.
*   **Error State**: Crimson borders with a highly visible helper subtitle.

### 2. Button System
*   **Primary Call-to-Action (CTA)**:
    *   *Style*: High-contrast background (brand blue), bright bold text, slight elevation or drop shadow.
    ```css
    @apply bg-brand-blue hover:bg-brand-blue/90 text-white py-3 px-6 rounded-xl font-display font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-brand-blue/15 active:scale-[0.98] cursor-pointer;
    ```
*   **Secondary Option**:
    *   *Style*: Transparent background, clear border line (`border-brand-border`), clean hover highlight (`hover:bg-white/5 hover:border-slate-500`).

### 3. Cards & Surfaces
*   **Glass Containers (`glass-card`)**:
    *   *Style*: Backdrop blurred deep surface, highly subtle border.
    ```css
    @apply bg-brand-dark-2/85 backdrop-blur-lg border border-brand-border rounded-2xl p-6 shadow-2xl;
    ```
*   **Stateful Cards (Hoverable/Clickable)**:
    *   *Style*: Smooth vertical translation on hover (`hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-2xl transition-all duration-300`).

---

## 6. Layout Archetypes for Educational Delivery

### Single-View App Shell (Tabbed Platform)
For our core testing features (Teori, Eksamen, Bank), the main view lives inside a structured, full-screen **App Shell**:
1.  **Persistent Top Bar**: Displays active category (with colored icon), subscription expiry status, language toggle, and exit/logout commands.
2.  **Segmented Navigation Tabs**: Equal-width tab buttons displaying icons and labels clearly. Avoid secondary visual sliders. Horizontal scrolling handles overflow gracefully.
3.  **Active Content Workspace**: Large scrollable viewport containing centered, generous layout grids for active content. Content wraps elegantly at `max-w-4xl`.

---

## 7. Multilingual Symmetry & RTL Considerations

Because Teorigo supports both left-to-right (LTR) and right-to-left (RTL) reading patterns (Arabic natively), all styling rules must dynamically adapt:

*   **Directionality Check**: The `.rtl` wrapper applies `direction: rtl` to align text, paragraphs, and list flows seamlessly.
*   **Icons**: Arrows and back-navigation icons must mirror dynamically in RTL to maintain intuitive visual context.
*   **Grid Order**: Relative padding (`pl`, `pr`, etc.) must use logical directions where possible, or translate as inline CSS selectors matching the active language state.

---

This design framework dictates all future component adjustments, color mappings, and visual updates for the Teorigo application. All code changes should strictly refer to these design properties to maintain visual excellence.
