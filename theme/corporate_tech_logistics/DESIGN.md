---
name: Corporate Tech Logistics
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444651'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#222a3e'
  on-tertiary: '#ffffff'
  tertiary-container: '#384055'
  on-tertiary-container: '#a4acc5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is engineered for internal IT logistics, asset tracking, and hardware requisition. The target audience encompasses IT technicians, systems engineers, procurement officers, and corporate employees submitting resource requests. The primary emotional tone is authoritative, highly dependable, agile, and structured. 

The aesthetic adheres to **Corporate / Modern** principles with dense utilitarian capability. It avoids frivolous visual distractions in favor of scannable data layouts, high-contrast statuses, structured form inputs, and crisp structural dividers. Visual rhythm is disciplined and functional, instilling confidence during high-volume inventory transactions and audit reviews.

## Colors

The palette establishes an enterprise IT hierarchy. Dominant surfaces utilize `#F8FAFC` to create an ergonomic, glare-free canvas, while container elements rest on pure `#FFFFFF` bounded by hairline `#E2E8F0` borders. 

- **Primary (`#1E3A8A`)**: Deep Navy deployed for top application headers, active navigation anchors, and institutional branding touchpoints.
- **Secondary (`#2563EB`)**: Royal Blue designated for interactive triggers, primary action buttons, active tab indicators, and progress markers.
- **Neutral Stack**: `#0F172A` delivers high-contrast legibility for data points and titles; `#475569` handles metadata, field labels, and secondary context; `#E2E8F0` dictates structural divisions.
- **System Feedback Statuses**:
  - Critical / Low Stock: `#EF4444` (Text/Icon) paired with `#FEF2F2` (Background tint).
  - Success / Approved: `#10B981` paired with `#ECFDF5`.
  - Warning / Pending: `#F59E0B` paired with `#FFFBEB`.

## Typography

Typography relies uniformly on **Inter** to ensure geometric balance, high legibility across dense data tables, and distinct tabular figures. 

All monetary values, serial numbers, IP configurations, and asset tags require font variant settings enabling tabular numerals (`tnum`) to align vertically without horizontal drift. Letter-spacing is slightly contracted (`-0.01em`) on large metrics cards and displays, while uppercase status labels utilize expanded tracking (`+0.04em`) to maximize scannability at small sizes.

## Layout & Spacing

The layout model is governed by a responsive 12-column fluid grid system pinned to a maximum canvas constraint of 1600px.

- **Desktop (1024px+)**: 12 columns with 24px gutters (`gutter-lg`) and 32px outer margins (`margin-lg`). Accommodates fixed left-hand navigation (260px) alongside flexible content panes.
- **Tablet (768px - 1023px)**: 8 columns with 16px gutters (`gutter`) and 24px margins (`margin-md`). Sidebar collapses to an icon rail or off-canvas drawer.
- **Mobile (< 768px)**: 4 columns with 16px gutters and 16px margins (`margin`). Dense data tables horizontally scroll within localized card wrappers.

Component internal spacing adheres strictly to an 8pt architectural rhythm, with a 4pt sub-grid reserved for tight input paddings, table cells, and status badges.

## Elevation & Depth

This system avoids heavy drop shadows, opting instead for **low-contrast outlines** paired with shallow, soft ambient occlusion to emphasize structure over theatrical dimensionality:

- **Flat / Base**: `#FFFFFF` card surfaces sitting on `#F8FAFC`, enclosed by a uniform `1px solid #E2E8F0` border. Zero shadow.
- **Resting Cards & Metric Tiles**: `1px solid #E2E8F0`, accompanied by an ambient shadow `0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Dropdowns & Popovers**: `1px solid #CBD5E1`, with shadow `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Modals & Drawers**: Backdrop overlay `rgba(15, 23, 42, 0.60)` with surface elevation `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)`.

## Shapes

The interface embraces a **Soft (Level 1)** geometric standard. Containers, input fields, and metric cards maintain a concise 6px (`0.375rem`) to 8px (`0.5rem`) corner radius. This conveys architectural precision suitable for enterprise asset control while avoiding aggressive sharp edges.

Status badges and pill tags are the sole exception, applying full 9999px rounding (`pill`) to contrast distinctly against structural data tables and rectangular form controls.

## Components

### Buttons
- **Primary**: Solid background `#2563EB`, text `#FFFFFF`, radius 6px, hover state `#1D4ED8`, active `#1E40AF`.
- **Secondary**: Surface `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`, hover `#F1F5F9`.
- **Destructive**: Surface `#EF4444`, text `#FFFFFF`, hover `#DC2626`.
- **Ghost / Link**: Transparent surface, text `#2563EB`, hover background `#EFF6FF`.

### Status Badges & Chips
- Designed with 9999px pill radius, `py: 2px`, `px: 8px`, `font-size: 11px`, `font-weight: 600`, uppercase tracking.
- **Approved / Em Estoque**: Background `#ECFDF5`, text `#065F46`, border `1px solid #A7F3D0`.
- **Pendente / Alocado**: Background `#FFFBEB`, text `#92400E`, border `1px solid #FDE68A`.
- **Crítico / Esgotado**: Background `#FEF2F2`, text `#991B1B`, border `1px solid #FECACA`.

### Metric Cards (KPIs)
- Background `#FFFFFF`, border `1px solid #E2E8F0`, padding 16px.
- Layout: Icon badge (40x40px, rounded-md, soft background), metric value (`headline-lg`, `#0F172A`), label (`body-sm`, `#475569`), trend indicator footer.

### Form Inputs
- Height 40px, background `#FFFFFF`, border `1px solid #CBD5E1`, radius 6px, text `#0F172A`, placeholder `#94A3B8`.
- Focus state: Outline `2px solid #2563EB` with an offset of 1px.
- Error state: Border `#EF4444`, feedback message in `#EF4444` (`body-sm`).

### Inventory Tables
- Header: `#F8FAFC`, text `#475569`, uppercase, `label-sm`, border-bottom `1px solid #E2E8F0`.
- Row height: 48px standard, alternating or clean white with hover highlight `#F8FAFC`.
- Cells: Text `#0F172A`, `body-md`, tabular numerical alignment for quantities and serial codes.

### Requisition Flow Cards
- Linear status progression tracker using horizontal nodes connected by 2px `#E2E8F0` rules (active `#2563EB`). Contains timestamp, operator badge, and approval checkbox triggers.