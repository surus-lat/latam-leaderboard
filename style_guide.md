# Style Guide

This document outlines the design system and coding conventions for the LatamBoard frontend application.

## Design System

### Color Palette

The application uses a minimalistic neutral palette with subtle pastel accents, defined through CSS custom properties:

#### Light Mode (Default)
- **Background**: `hsl(0 0% 99%)` - Pure white with subtle warmth
- **Foreground**: `hsl(0 0% 8%)` - Near-black text
- **Primary**: `hsl(220 15% 75%)` - Muted blue-gray for accents
- **Card**: `hsl(0 0% 98%)` - Slight off-white for elevated surfaces
- **Muted**: `hsl(0 0% 94%)` - Light gray for backgrounds
- **Border**: `hsl(0 0% 90%)` - Subtle borders

#### Dark Mode
- **Background**: `hsl(0 0% 5%)` - Deep dark background
- **Foreground**: `hsl(0 0% 92%)` - Light text
- **Primary**: `hsl(220 15% 60%)` - Adjusted blue-gray for dark theme
- **Card**: `hsl(0 0% 7%)` - Elevated dark surfaces

#### Score Colors
Performance indicators use subtle, non-aggressive colors:
- **Excellent**: `hsl(150 20% 65%)` - Muted green
- **Good**: `hsl(200 20% 65%)` - Muted blue
- **Average**: `hsl(40 25% 70%)` - Muted yellow
- **Poor**: `hsl(0 25% 70%)` - Muted red

### Typography

- **Primary Font**: Inter (`font-inter`)
- **Logo/Monospace**: Font mono for brand elements (`font-mono`)
- **Font Features**: `rlig`, `calt` enabled for optimal legibility
- **Headings**: `font-medium tracking-tight` for clean, modern hierarchy

### Spacing & Layout

#### Custom Spacing
- **18**: `4.5rem` (72px) - Extra spacing unit
- **88**: `22rem` (352px) - Large layout spacing

#### Container System
```css
.container {
  @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
}
```

#### Grid Layouts
- Mobile-first responsive grid: `grid md:grid-cols-2 lg:grid-cols-3`
- Main layout: 1/5 sidebar, 4/5 content split

### Visual Effects

#### Shadows
- **Elegant**: `0 4px 20px -2px hsl(var(--foreground) / 0.1)` - Subtle depth
- **Glow**: `0 0 20px hsl(var(--primary) / 0.3)` - Accent highlights

#### Gradients
- **Hero**: `linear-gradient(180deg, background → slightly darker)`
- **Card**: `linear-gradient(180deg, card → slightly darker)`

#### Animations
Custom keyframes for smooth interactions:
- **fade-in**: 0.5s opacity + translateY
- **scale-in**: 0.3s scale transform
- **slide-in**: 0.4s translateX
- **accordion**: height transitions for expandable content

## Component Conventions

### File Structure
```
src/
├── components/ui/          # Reusable UI components
├── pages/                  # Route-level components
├── i18n/                   # Internationalization
└── assets/                 # Static assets
```

### Component Patterns

#### 1. Component Files
- Use PascalCase for component files: `HeroSection.tsx`
- Export named functions: `export function HeroSection()`
- Props interfaces named with `Props` suffix: `FilterPanelProps`

#### 2. CSS Class Structure

**Base Classes**
```css
.card              /* Base card component */
.card-elevated     /* Enhanced shadow variant */
.btn               /* Base button styles */
.badge             /* Base badge/tag styles */
```

**Button Variants**
```css
.btn-primary       /* Primary action buttons */
.btn-secondary     /* Secondary actions */
.btn-ghost         /* Subtle hover-only buttons */
.btn-outline       /* Outlined buttons */
```

**Badge Variants**
```css
.badge-default     /* Primary badge */
.badge-secondary   /* Muted badge */
.badge-outline     /* Outlined badge */
.badge-success     /* Success state */
.badge-warning     /* Warning state */
.badge-destructive /* Error state */
```

**Score Display**
```css
.score-minimal     /* Base score styling */
.score-excellent   /* High performance */
.score-good        /* Good performance */
.score-average     /* Average performance */
.score-poor        /* Low performance */
```

#### 3. Responsive Design

**Breakpoint Strategy**
- Mobile-first approach
- Use `md:` and `lg:` prefixes
- Hidden on mobile: `hidden md:block`
- Mobile menu: `md:hidden`

**Layout Patterns**
```jsx
{/* Sidebar + Main Content */}
<div className="flex gap-8">
  <div className="w-1/5">Sidebar</div>
  <div className="w-4/5">Main</div>
</div>

{/* Responsive Grid */}
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### 4. Interactive Elements

**State Management**
- Use `useState` for component-level state
- Prop drilling for simple data flow
- Boolean states for toggles: `expanded`, `isOpen`

**Event Handlers**
```jsx
function handleSort(col: string) { /* ... */ }
function toggleColumn(col: string) { /* ... */ }
function toggle(id: string) { /* ... */ }
```

**Accessibility**
- `role="button"` for non-button interactive elements
- `tabIndex={0}` for keyboard navigation
- `aria-expanded` for expandable content
- `aria-label` for icon-only buttons

#### 5. Styling Patterns

**Conditional Classes**
```jsx
className={`base-class ${condition ? 'active-class' : 'inactive-class'}`}
```

**Component State Styling**
```jsx
const getBadgeStyle = (isActive: boolean) => {
  return isActive ? 'badge-default' : 'badge-outline hover:bg-accent'
}
```

**Hover & Transition States**
- All interactive elements: `transition-colors`
- Enhanced interactions: `transition-all duration-200`
- Scale effects: `hover:scale-[1.02] active:scale-[0.98]`

### Data Handling Patterns

#### Type Definitions
```typescript
type LeaderboardRow = Record<string, string | number | null>
type Task = {
  name: string
  group: string
  description: string
  long_description: string
}
```

#### Loading States
```jsx
{loading && <div className="text-muted-foreground">Loading...</div>}
{error && <div className="text-destructive">{error}</div>}
```

#### Data Transformation
- Use `useMemo` for expensive computations
- Sort/filter operations cached with dependencies
- Column visibility managed through arrays

### Internationalization

#### Translation Keys
- Dot notation: `t('landing.source_prefix')`
- Fallback to key if translation missing
- Locale-specific content with suffixes: `name_en`, `name_es`, `name_pt`

#### Language Detection
- Auto-detect from browser: `navigator.language`
- Store preference: `localStorage.getItem('locale')`
- Set document lang: `document.documentElement.lang`

## Code Quality

### ESLint Configuration
- React hooks rules enforced
- TypeScript strict mode enabled
- No unused variables/imports

### Performance Considerations
- Lazy load images and assets
- Memoize expensive calculations
- Virtualize long lists if needed
- Optimize bundle size with tree shaking

### Accessibility Requirements
- Semantic HTML elements
- WCAG AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios met

## Development Workflow

### Component Development
1. Create component in appropriate directory
2. Define TypeScript interfaces for props
3. Implement responsive design mobile-first
4. Add proper accessibility attributes
5. Test with multiple screen sizes
6. Verify internationalization support

### Styling Workflow
1. Use existing design tokens from `src/index.css`
2. Extend Tailwind config for new utilities if needed
3. Maintain consistency with established patterns
4. Test both light and dark modes
5. Verify responsive behavior

### Testing Considerations
- Components should handle loading states
- Error boundaries for data fetching
- Responsive design testing required
- Cross-browser compatibility verification