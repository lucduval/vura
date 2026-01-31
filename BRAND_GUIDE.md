# Vura Brand Style Guide

> **Mission:** Stop payment fraud for SMEs through AI-powered proof of payment verification.

---

## 🎨 Color Palette

### Primary Colors (OKLCH Format)

| Role | Light Mode | Dark Mode | Usage |
|------|------------|-----------|-------|
| **Background** | `oklch(1 0 0)` / `#FFFFFF` | `oklch(0.145 0 0)` / `#0D0D0D` | Page backgrounds |
| **Foreground** | `oklch(0.145 0 0)` / `#0D0D0D` | `oklch(0.985 0 0)` / `#FAFAFA` | Primary text |
| **Primary** | `oklch(0.205 0 0)` / `#1A1A1A` | `oklch(0.922 0 0)` / `#E8E8E8` | Buttons, CTAs |
| **Secondary** | `oklch(0.97 0 0)` / `#F5F5F5` | `oklch(0.269 0 0)` / `#2A2A2A` | Secondary elements |
| **Muted** | `oklch(0.97 0 0)` / `#F5F5F5` | `oklch(0.269 0 0)` / `#2A2A2A` | Subdued backgrounds |
| **Accent** | `oklch(0.97 0 0)` / `#F5F5F5` | `oklch(0.269 0 0)` / `#2A2A2A` | Highlights |
| **Destructive** | `oklch(0.577 0.245 27.325)` / `#DC2626` | `oklch(0.704 0.191 22.216)` / `#EF4444` | Errors, warnings |

### Chart Colors

| Chart | Light Mode | Dark Mode | Suggested Use |
|-------|------------|-----------|---------------|
| **Chart 1** | `oklch(0.646 0.222 41.116)` - Orange | `oklch(0.488 0.243 264.376)` - Blue | Primary metric |
| **Chart 2** | `oklch(0.6 0.118 184.704)` - Teal | `oklch(0.696 0.17 162.48)` - Green | Secondary metric |
| **Chart 3** | `oklch(0.398 0.07 227.392)` - Slate | `oklch(0.769 0.188 70.08)` - Yellow | Tertiary metric |
| **Chart 4** | `oklch(0.828 0.189 84.429)` - Yellow | `oklch(0.627 0.265 303.9)` - Purple | Quaternary metric |
| **Chart 5** | `oklch(0.769 0.188 70.08)` - Amber | `oklch(0.645 0.246 16.439)` - Red | Quinary metric |

### Semantic Colors (Hex Equivalents for Easy Use)

```css
/* Brand Recommended Colors */
--vura-indigo: #4F46E5;      /* Trust, professionalism */
--vura-emerald: #10B981;     /* Verification, success */
--vura-violet: #8B5CF6;      /* Highlights, gradients */
--vura-slate: #1E293B;       /* Dark text, navigation */
--vura-gray: #F8FAFC;        /* Light backgrounds */
--vura-red: #DC2626;         /* Errors, fraud alerts */
--vura-amber: #F59E0B;       /* Warnings, pending states */
```

---

## ✏️ Typography

### Font Family

| Role | Font | CSS Variable | Fallback |
|------|------|--------------|----------|
| **Primary (Sans)** | Geist | `--font-geist-sans` | `system-ui, sans-serif` |
| **Monospace** | Geist Mono | `--font-geist-mono` | `monospace` |

### Font Installation (Next.js)

```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

### Type Scale (Recommended)

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| **H1** | 3rem (48px) | 700 (Bold) | 1.1 |
| **H2** | 2.25rem (36px) | 600 (Semibold) | 1.2 |
| **H3** | 1.5rem (24px) | 600 (Semibold) | 1.3 |
| **H4** | 1.25rem (20px) | 500 (Medium) | 1.4 |
| **Body** | 1rem (16px) | 400 (Regular) | 1.6 |
| **Small** | 0.875rem (14px) | 400 (Regular) | 1.5 |
| **Caption** | 0.75rem (12px) | 400 (Regular) | 1.4 |

---

## 📐 Border Radius

| Size | Value | Usage |
|------|-------|-------|
| **sm** | `calc(0.625rem - 4px)` = 6px | Small buttons, tags |
| **md** | `calc(0.625rem - 2px)` = 8px | Inputs, small cards |
| **lg** | `0.625rem` = 10px | Cards, modals |
| **xl** | `calc(0.625rem + 4px)` = 14px | Large cards |
| **2xl** | `calc(0.625rem + 8px)` = 18px | Hero sections |
| **3xl** | `calc(0.625rem + 12px)` = 22px | Large containers |
| **4xl** | `calc(0.625rem + 16px)` = 26px | Full sections |

---

## 🎯 Iconography

### Icon Library
**Lucide React** - Modern, clean, consistent icons

### Installation
```bash
npm install lucide-react
```

### Core Icons Used

| Category | Icons | Usage |
|----------|-------|-------|
| **Navigation** | `Menu`, `LayoutDashboard`, `Settings` | Sidebar, header |
| **Actions** | `Send`, `Upload`, `Copy`, `RefreshCw` | User interactions |
| **Status** | `CheckCircle`, `AlertCircle`, `Clock`, `Loader2` | State indicators |
| **Finance** | `Landmark`, `FileText`, `FileSpreadsheet`, `FileBarChart` | Financial operations |
| **Security** | `ShieldAlert` | Fraud alerts |
| **Communication** | `MessageSquare`, `Bell`, `Mail`, `Phone` | Messaging features |
| **Social** | `Twitter`, `Linkedin`, `Instagram` | Footer links |
| **AI/Tech** | `BrainCircuit`, `Sparkles` | AI features |

### Icon Usage Example
```tsx
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

// Success state
<CheckCircle className="h-5 w-5 text-emerald-500" />

// Warning state  
<AlertCircle className="h-5 w-5 text-amber-500" />

// Pending state
<Clock className="h-5 w-5 text-slate-400" />
```

---

## 🧩 Component Styling

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: oklch(0.205 0 0);
  color: oklch(0.985 0 0);
  border-radius: 0.625rem;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 150ms ease;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* Secondary Button */
.btn-secondary {
  background: oklch(0.97 0 0);
  color: oklch(0.205 0 0);
  border: 1px solid oklch(0.922 0 0);
}

/* Destructive Button */
.btn-destructive {
  background: oklch(0.577 0.245 27.325);
  color: white;
}
```

### Cards

```css
.card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Inputs

```css
.input {
  background: var(--background);
  border: 1px solid var(--input);
  border-radius: var(--radius-md);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  outline-color: var(--ring);
}

.input:focus {
  border-color: var(--ring);
  box-shadow: 0 0 0 2px var(--ring);
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| **sm** | 640px | Mobile landscape |
| **md** | 768px | Tablets |
| **lg** | 1024px | Small laptops |
| **xl** | 1280px | Desktops |
| **2xl** | 1536px | Large screens |

---

## 🌓 Dark Mode

Apply the `.dark` class to the `<html>` or `<body>` element to enable dark mode. All CSS variables automatically switch.

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

---

## 📦 Quick Start CSS

Copy this into your project's `globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## 📚 Dependencies

```json
{
  "dependencies": {
    "next": "^16.x",
    "react": "^19.x",
    "lucide-react": "^0.x",
    "tailwindcss": "^4.x",
    "tw-animate-css": "^1.x"
  }
}
```

---

*Vura Brand Guide v1.0 - January 2026*
