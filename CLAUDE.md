# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LatamBoard is a React + Vite application for evaluating LLMs on Spanish and Portuguese tasks. It features a sortable/filterable leaderboard table, task descriptions, and data sourced from a Hugging Face dataset.

## Development Commands

### Setup & Development
- `npm install` - Install dependencies
- `npm run fetch:data` - Download latest dataset from Hugging Face into /public
- `npm run dev` - Start development server (runs on port 8080)

### Build & Quality
- `npm run build` - Production build
- `npm run build:dev` - Development mode build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Data Management
The `npm run fetch:data` script downloads JSON files from a Hugging Face dataset. Key environment variables:
- `LEADERBOARD_DATA_URL` - Base URL (defaults to HF dataset resolve path)
- `LEADERBOARD_DATA_FILES` - Comma-separated files to fetch
- `LEADERBOARD_FETCH_ALL=true` - Fetch entire dataset repo
- `HF_TOKEN` - Optional token for private/rate-limited access

## Architecture

### Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS with custom design system
- **Routing**: React Router DOM
- **Internationalization**: Custom i18n system supporting EN/ES/PT
- **Data**: Static JSON files in /public (no backend)

### Key Directories
- `/src/pages/` - Route components (Landing, About, Tests, Submit)
- `/src/components/ui/` - Reusable UI components
- `/src/i18n/` - Internationalization system with locale detection
- `/src/content/` - Static content files
- `/public/` - Dataset JSON files (populated by fetch-data script)
- `/scripts/` - Data fetching utilities

### Design System
- Custom CSS variables defined in `src/index.css`
- Extended Tailwind config with brand colors, animations, and spacing
- Score-specific color system (excellent, good, average, poor)
- Inter font family as primary typeface

### Data Flow
1. Dataset files are fetched from Hugging Face via `npm run fetch:data`
2. JSON files stored in `/public/` are loaded by React components
3. Landing page displays sortable leaderboard table with column toggles
4. Tests page shows expandable task group cards
5. All content supports multilingual display via i18n system

### Internationalization
- Auto-detects browser language (falls back to English)
- Stores locale preference in localStorage
- Translation files organized by locale in `/src/i18n/`
- `useI18n()` hook provides `t()` function and locale switching

### Component Patterns
- Pages are route-level components handling data fetching
- UI components follow shadcn/ui patterns
- Heavy use of Tailwind utility classes
- Custom animations for smooth transitions
- Responsive design with mobile-first approach