---
name: Car Luxe Admin
colors:
  surface: '#131411'
  surface-dim: '#131411'
  surface-bright: '#3a3936'
  surface-container-lowest: '#0e0e0c'
  surface-container-low: '#1c1c19'
  surface-container: '#20201d'
  surface-container-high: '#2a2a27'
  surface-container-highest: '#353532'
  on-surface: '#e5e2dd'
  on-surface-variant: '#d0c5b2'
  inverse-surface: '#e5e2dd'
  inverse-on-surface: '#31302d'
  outline: '#99907e'
  outline-variant: '#4d4637'
  surface-tint: '#e6c364'
  primary: '#e6c364'
  on-primary: '#3d2e00'
  primary-container: '#c9a84c'
  on-primary-container: '#503d00'
  inverse-primary: '#755b00'
  secondary: '#c8c6c5'
  on-secondary: '#303030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#ffb697'
  on-tertiary: '#581e00'
  tertiary-container: '#ff8d58'
  on-tertiary-container: '#712900'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe08f'
  primary-fixed-dim: '#e6c364'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#131411'
  on-background: '#e5e2dd'
  surface-variant: '#353532'
typography:
  h1:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Montserrat
    fontSize: 22px
    fontWeight: '500'
    lineHeight: '1.3'
  h3:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.4'
  body:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Montserrat
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 32px
  xl: 48px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is engineered for the elite tier of automotive service management. It prioritizes a high-end, "concierge-level" aesthetic that mirrors the experience of luxury car ownership. The visual language is rooted in **Minimalism** with **Modern Corporate** precision, utilizing an absolute dark environment to reduce visual noise and emphasize high-value data.

The personality is authoritative and sleek. It avoids decorative clutter in favor of crisp borders, purposeful gradients, and a rich gold accent that signifies prestige. Every interaction is designed to feel heavy and deliberate, evoking the tactile feel of premium vehicle interiors and high-performance machinery.

## Colors

The color strategy uses a "nested darkness" approach to establish hierarchy without relying on shadows. The deepest black (#0D0D0D) serves as the foundation for the sidebar and main body, while the content area sits on a slightly lighter mid-tone (#171717). 

Primary interactive elements use a refined Gold (#C9A84C), creating a high-contrast focal point against the dark surfaces. High-priority calls to action utilize a spectrum Brand Gradient, injecting a sense of motion and speed into the administrative workflow. Status indicators are calibrated for maximum legibility, using a 20% alpha tint for backgrounds to ensure they remain secondary to the primary content while still being instantly recognizable.

## Typography

Typography in this design system is built around **Montserrat**, chosen for its geometric purity and modern architectural feel. 

The hierarchy is strictly enforced: H1 headers command attention for page titles, while labels provide a distinct metadata layer. These labels are always rendered in the primary Gold accent, set in uppercase with increased tracking (0.1em) to differentiate them from standard body text and to serve as structural signposts throughout the dashboard. Text contrast is carefully balanced, using an off-white (#F0EDE8) for primary reading to prevent eye strain on absolute black backgrounds.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** with fixed gutters of 24px. The layout is optimized for high-density information displays across large-format monitors.

The spacing rhythm is based on an 8px scale, ensuring consistent alignment of elements. Margins are generous at 32px to create a "gallery" feel for the dashboard cards, allowing the premium content to breathe. Containers should snap to the grid, but internal padding within cards and modals remains consistent at 24px (md) to maintain a cohesive internal structure.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional shadows. This creates a flat, sleek appearance consistent with high-end digital instrumentation.

- **Level 0 (Base):** #0D0D0D (Sidebar and global backdrop)
- **Level 1 (Content Area):** #171717 (Main stage for activity)
- **Level 2 (Surface):** #222222 (Cards, tables, and dialogs)

Each surface is defined by a 0.5px or 1px border (#2E2E2E). This razor-thin line provides enough separation to distinguish layers without introducing the visual bulk of heavy shadows. When modals are active, a 60% opacity black backdrop is used to dim the background layers, maintaining focus on the surface level.

## Shapes

The shape language reflects a balance between technical precision and modern comfort. 

- **Primary Containers (Cards):** Use a 12px radius to soften the high-contrast interface.
- **Form Controls (Inputs/Buttons):** Use a tighter 8px radius to feel more like tactile, machined buttons.
- **Indicators (Badges):** Use a full pill shape (999px) to provide a distinct silhouette that contrasts against the rectangular grid of the dashboard.

This variation in corner radii helps users subconsciously categorize elements: large rounded corners for content areas, and sharper corners for interactive tools.

## Components

### Buttons
- **Primary:** Utilizes the full Brand Gradient. Text is bold, black (#0D0D0D) for maximum punch. Used for critical actions like "Confirm Service" or "New Vehicle."
- **Secondary:** Transparent background with a Gold (#C9A84C) border and Gold text. Used for standard actions.
- **Ghost:** Muted text (#5E5E5E), transitioning to white on hover. Used for tertiary actions.

### Status Badges
Status badges use a pill shape with a background color set to 20% opacity of the status hex code, and a solid 100% opacity text color. This ensures the badge is legible without competing with the primary accent colors.

### Tables
Tables sit on Level 2 surfaces (#222222). The header row is defined by a bottom border (#2E2E2E). Alternating rows use #1E1E1E to assist with horizontal scanning of vehicle and owner data.

### Input Fields
Inputs are recessed, using the Page Background (#171717) and an 8px radius. The 1px border highlights in Gold (#C9A84C) upon focus. Labels for inputs should always follow the Label-Caps typography style.

### Cards
Cards are the primary container for dashboard modules. They feature a 0.5px border (#2E2E2E) and 24px of internal padding. Titles within cards should use the H3 style.