---
name: Design Guidelines
description: Design system and guidelines for AI Math Solver to ensure consistency.
---

# Design Guidelines

This document outlines the design system for the AI Math Solver application. Adhere to these guidelines to maintain a consistent, modern, and accessible user experience.

## Core Philosophy
-   **Modern & Clean**: Use ample whitespace, rounded corners (`rounded-2xl`), and subtle shadows.
-   **Mobile-First**: Design for small screens first, then adapt for larger displays.
-   **Feedback-Driven**: Interactive elements must provide visual feedback (e.g., hover states, active scaling).

## Technology Stack
-   **CSS Framework**: Tailwind CSS v4
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Fonts**: `Geist` (Sans & Mono) via `next/font`

## Color Palette

### Base
| Role | Light Mode | Dark Mode | Tailwind Class |
| :--- | :--- | :--- | :--- |
| Background | `#ffffff` | `#0a0a0a` | `bg-background` |
| Foreground (Text) | `#171717` | `#ededed` | `text-foreground` |

### Primary Actions
-   **Brand Color**: Blue
-   **Default**: `bg-blue-600` (`#2563eb`)
-   **Hover**: `bg-blue-700` (`#1d4ed8`)
-   **Text**: `text-white`

### Secondary Actions / UI Elements
-   **Background**: `bg-gray-200`
-   **Hover**: `bg-gray-300`
-   **Text**: `text-gray-800`
-   **Subtle Backgrounds**: `bg-blue-50` (for icon containers, etc.)

## Typography

-   **Font Family**:
    -   Sans: `var(--font-geist-sans)` (Default)
    -   Mono: `var(--font-geist-mono)` (Code, Math)
-   **Hierarchy**:
    -   **Page Title**: `text-2xl font-bold` (e.g., "Snap a Question")
    -   **Button Text**: `text-lg font-bold` (Primary), `font-medium` (Secondary)
    -   **Body**: `text-base`
    -   **Caption/Hint**: `text-sm text-gray-500`

## UI Components & Patterns

### Buttons
All primary action buttons should follow this pattern:
```tsx
<button className="w-full max-w-xs px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition transform active:scale-95 flex items-center justify-center gap-3">
  <Icon size={24} />
  Button Text
</button>
```
-   **Radius**: `rounded-2xl`
-   **Interaction**: `active:scale-95` (click animation), `transition`
-   **Shadow**: `shadow-lg`

### Cards / Containers
-   **Radius**: `rounded-2xl`
-   **Shadow**: `shadow-lg` (if floating)
-   **Border**: `border-4 border-white` (for image previews) / `border border-gray-200` (generic)

### Icons
-   **Library**: Lucide React
-   **Standard Sizes**:
    -   Large / Hero: `size={64}` (w-16 h-16)
    -   Button Icons: `size={24}`
    -   Small / Inline: `size={20}`

## Layout
-   **Spacing**: Generous padding (`py-12` for main container).
-   **Alignment**: Flexbox centering (`flex flex-col items-center`).
-   **Max Width**: `max-w-md` for main content blocks to ensure readability on desktop while maintaining mobile feel.
