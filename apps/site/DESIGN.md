---
name: CAR LUXE
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e4e2e1'
  on-surface-variant: '#d0c5b2'
  inverse-surface: '#e4e2e1'
  inverse-on-surface: '#303030'
  outline: '#99907e'
  outline-variant: '#4d4637'
  surface-tint: '#e6c364'
  primary: '#e6c364'
  on-primary: '#3d2e00'
  primary-container: '#c9a84c'
  on-primary-container: '#503d00'
  inverse-primary: '#755b00'
  secondary: '#c9c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#ffb2c2'
  on-tertiary: '#66002b'
  tertiary-container: '#ff86a5'
  on-tertiary-container: '#830039'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe08f'
  primary-fixed-dim: '#e6c364'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffd9df'
  tertiary-fixed-dim: '#ffb1c2'
  on-tertiary-fixed: '#3f0018'
  on-tertiary-fixed-variant: '#8f003f'
  background: '#131313'
  on-background: '#e4e2e1'
  surface-variant: '#353535'
typography:
  h1:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  h2:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  h3:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.1em
  button-text:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max-width: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-padding: 80px
---

## Brand & Style
This design system is engineered for the elite automotive sector, prioritizing "Absolute Dark" aesthetics to mirror the environment of a high-end vehicle configurator. The brand personality is exclusive, precision-focused, and sophisticated. 

The visual style is **Minimalism** blended with **Corporate Modern**. It relies on deep tonal layering rather than shadows, utilizing high-contrast accents and hairline borders to convey craftsmanship. The emotional response is one of quiet power and technical excellence, ensuring the automotive photography remains the focal point while the interface feels like a bespoke digital cockpit.

## Colors
The palette is rooted in a tri-tier black system to create depth without relying on traditional lighting. The primary gold accent is reserved for interactive elements and brand signaling, providing a warm, metallic contrast to the cold, dark surfaces. 

The Brand Gradient is a high-energy "ignition" element. It must be used sparingly, reserved exclusively for primary Call-to-Action buttons and Hero-level typography to signify peak performance and premium status.

## Typography
The typography in this design system utilizes Montserrat for its geometric clarity and modern architectural feel. Headlines are weighted to provide a sense of stability and permanence. 

Body text is intentionally set in a secondary neutral (#A8A8A8) to reduce visual fatigue and ensure that the primary Gold and Gradient elements maintain their hierarchical dominance. Labels act as technical metadata, utilizing a tracked-out uppercase style to mimic automotive instrumentation and badges.

## Layout & Spacing
This design system employs a **Fixed Grid** philosophy to maintain a structured, editorial feel similar to luxury brochures. The standard layout utilizes a 12-column grid with a maximum content width of 1440px. 

Whitespace is treated as a premium commodity; section padding is generous to allow the high-end imagery of vehicles to "breathe." Alignment should be strict, favoring left-aligned typography for readability and technical precision.

## Elevation & Depth
Depth is conveyed through **Tonal Layers** and **Low-Contrast Outlines**. Instead of traditional drop shadows, which can feel muddy in dark mode, this design system uses background color shifts to indicate elevation:

1.  **Level 0 (Main Background):** #0D0D0D - The foundation.
2.  **Level 1 (Page Content):** #171717 - The primary canvas for text and imagery.
3.  **Level 2 (Interactive/Surfaces):** #222222 - Cards and modals.

Structural integrity is reinforced by hairline borders (0.5px to 1px) using the #2E2E2E token. This creates a "machined" look, suggesting precision engineering.

## Shapes
The shape language follows a "Sophisticated Geometric" approach. While the base roundedness is set to Level 2 (8px), specific components vary to create a visual hierarchy of containment. 

Cards utilize a slightly softer 12px radius to frame content as high-end "objects," while interactive elements like inputs and buttons use a tighter 8px radius to feel more functional and technical. Sharp corners are avoided to maintain a modern, approachable luxury feel.

## Components

### Buttons
*   **Primary:** Uses the Brand Gradient background with black text (#0D0D0D). Styled in bold, uppercase Montserrat with an 8px radius. Reserved for final conversion points (e.g., "Inquire Now," "Reserve").
*   **Secondary:** Outline style using the Primary Gold (#C9A84C) for the border and text. Background remains transparent to maintain the absolute dark aesthetic.

### Cards
*   **Aesthetic:** Background #222222 with a hairline 0.5px border (#2E2E2E). 12px corner radius.
*   **Usage:** Used for service categories, vehicle specs, and gallery items. Content inside should have a minimum of 24px internal padding.

### Inputs
*   **Aesthetic:** Background #171717 with a 1px border (#2E2E2E). 8px corner radius. Text is Main Text (#F0EDE8) to ensure high legibility during data entry.
*   **Focus State:** Border transitions to Primary Gold (#C9A84C).

### Header & Footer
*   **Structure:** Fixed position with a #0D0D0D background and a bottom/top border of #2E2E2E. 
*   **Logo:** The logo mark should utilize the Brand Gradient to act as the primary anchor for the identity.

### Additional Elements
*   **Status Chips:** Small, pill-shaped elements with Dark Gold (#8C7030) backgrounds and Gold (#C9A84C) text for indicating availability or luxury tiers.
*   **Dividers:** Horizontal lines should be 1px thick using the #2E2E2E border color, often used to separate technical specifications in a list format.