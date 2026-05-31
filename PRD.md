# Product Requirements Document (PRD) - Teorigo

## 1. Product Overview

**Name**: Teorigo (Teorigo.no)
**Description**: A comprehensive knowledge portal and learning platform for the Norwegian transport sector. It provides source-based knowledge on theory tests, transportation licenses, HSE (Health, Safety, Environment), driving and rest times, ADR (dangerous goods), and road safety. 
**Target Audience**: Drivers, students studying for the Norwegian theory tests, and transport companies.

## 2. Core Value Proposition
- **Source-based accuracy**: 100% verified knowledge.
- **Multilingual Support**: Supports Norwegian, English, Arabic, and Polish natively in a single interface to cater to diverse driving applicants.
- **Progressive Learning**: Flashcards, Quiz sets, and full Exam simulation formats.

## 3. Key Capabilities & Features

### 3.1. Multilingual Support
- **Supported Languages**: Norwegian (`no`), English (`en`), Arabic (`ar` - RTL supported), Polish (`pl`).
- **Dynamic Switching**: Instantly toggle translations via the UI.
- **Contextual Formatting**: Automatic RTL layout application when Arabic is selected.

### 3.2. Content Organization
- **Categories**: 8+ distinct knowledge categories (e.g., Theory tests, License classes, HSE, ADR).
- **Extensive FAQ**: 20+ FAQ questions for quick reference.

### 3.3. Learning Modes (App Shell Structure)
- **Home Tab (`home`)**: Overview of the selected category.
- **Flashcards Tab (`fc`)**: Study mode using interactive flashcards.
- **Quiz Tab (`quiz`)**: Practice questions with immediate feedback.
- **Exam Tab (`exam`)**: Timed/structured exam simulation mirroring real-world conditions.

### 3.4. Access Control & Monetization
- **Access Code System**: Users activate time-limited access using codes sent via email.
- **Access Tiers**:
  - `T24` - 24 hours access
  - `D3` - 3 days access
  - `D7` - 7 days access
- **Authentication**: Fully integrated with **Supabase Auth** (Email/Password registration and login). 
- **Security**: Content protection mechanisms integrated directly into the AppShell (prevention of right-click, screenshotting attempts, copying, and Developer Tools access).

### 3.5. Admin Dashboard
- **Access Code Generation**: Admins can bulk-generate access codes.
- **Usage Metrics**: View total generated codes and total redeemed codes.
- **Code Logging**: View expiration times, creator, redeemer, and redemption status for auditing.

## 4. Technical Architecture

- **Frontend**: React 18 / Vite SPA.
- **Styling**: Tailwind CSS for responsive, mobile-first design.
- **Animation**: `motion` (Framer Motion) for micro-interactions and route transitions.
- **Backend/Database**: Supabase (PostgreSQL) + Supabase Auth.
- **Icons**: Lucide React.
- **Theming**: Dark mode default ("Cosmic Slate" aesthetic) using deep blues, charcoal grays, and gradient glows.

## 5. Security & Constraints
- Content must remain highly protected since the questions are premium assets.
- Requires Supabase Row Level Security (RLS) configuration linked to users UUIDs and `access_codes` usage status.

## 6. Future Roadmap Considerations
- Expansion of content categories.
- Stripe payment integration to auto-provision access codes directly upon checkout rather than manual email delivery.
- AI-based intelligent question generation or tutor integrations.
