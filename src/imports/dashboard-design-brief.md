## Role
You are a Senior Product Designer specializing in responsive design systems,
dashboard UI/UX, and cross-platform design adaptation (mobile → web).

## Context
I have already uploaded my **mobile app design** to this conversation.
You have full visibility of:
- My color palette
- My typography
- My component styles (buttons, cards, inputs, nav, etc.)
- My feature set and screen flows

## Objective
Create a **web dashboard version** of my app for desktop/laptop use.
This is NOT a responsive version of the mobile app — it is a dedicated
**web dashboard experience** that:
- Contains **100% of the same features** as the mobile app
- Uses **100% of the same colors, fonts, and visual language**
- Adapts the layout, navigation, and information density
  for large screens (1280px – 1920px+)

## Design Principles for the Adaptation

### 1. Layout & Grid
- Use a **12-column grid** (or 16-column for data-heavy views).
- Default viewport targets:
  - **Primary**: 1440px wide
  - **Secondary**: 1280px and 1920px
- Use a **persistent sidebar navigation** (left side) instead of
  bottom tab bar or hamburger menu.
- Convert single-column mobile scrolls into **multi-panel layouts**:
  - Master-detail patterns (list on left, detail on right)
  - Side-by-side comparisons where the mobile version stacks vertically
- Use **cards and surface elevation** to visually group related content
  on the wider canvas.

### 2. Navigation Translation
Map every mobile navigation element to its web dashboard equivalent:

| Mobile Pattern             | Web Dashboard Equivalent                |
|----------------------------|-----------------------------------------|
| Bottom Tab Bar             | Left Sidebar (persistent, collapsible)  |
| Hamburger Menu             | Expanded sidebar with labels + icons    |
| Stack Navigation (push)    | In-page panel swap or breadcrumb trail  |
| Modal / Bottom Sheet       | Slide-over panel or centered modal      |
| Pull to Refresh            | Auto-refresh + manual refresh button    |
| Swipe Actions              | Hover-reveal actions or right-click menu|
| Toast / Snackbar           | Top-right notification toast            |
| Floating Action Button     | Primary action button in page header    |

### 3. Component Adaptation
For every component in my mobile app, produce the web equivalent:
- **Same border-radius, shadow, color, and font styles** — no changes.
- Adjust **sizing and spacing** for mouse/keyboard interaction:
  - Minimum click target: 32px (web) vs 44px (mobile)
  - Add hover states to all interactive elements
  - Add keyboard focus rings (visible, on-brand)
- **Tables**: Convert any mobile list/card view into a sortable,
  filterable data table where appropriate.
- **Forms**: Use multi-column form layouts instead of
  single-column stacked fields.
- **Charts/Data Viz**: Expand to fill available width;
  add tooltips on hover.

### 4. Information Density
- Web users expect **higher information density**.
  Show more data per viewport without scrolling.
- Where the mobile app shows 3–5 list items before scroll,
  the web dashboard should show 10–20 rows.
- Use **progressive disclosure**: summary cards on the main view,
  expandable detail on click.

### 5. Feature Parity Checklist
Go through **every screen and feature** in my mobile app and confirm:
- [ ] It exists in the web dashboard
- [ ] It is reachable from the sidebar or a logical sub-page
- [ ] The interaction pattern is adapted for mouse + keyboard
- [ ] The data shown is identical (no missing fields)
- [ ] The visual style matches (colors, fonts, radius, shadows)

### 6. Web-Specific Enhancements (Additive Only)
You may ADD the following if they make sense — but never remove
or alter existing features:
- Keyboard shortcuts for power users
- Breadcrumb navigation for deep flows
- Multi-select / bulk actions in tables
- Drag-and-drop where mobile used long-press reorder
- Wider search bar with filters always visible
- Collapsible sidebar (icon-only mode) for more content space

### 7. Responsive Behavior of the Web Dashboard Itself
Even though this is a desktop-first dashboard, define behavior at:
- **≥ 1920px**: Content max-width or stretch with larger gutters
- **1440px**: Primary design target
- **1280px**: Sidebar collapses to icon-only by default
- **1024px**: Consider stacking some panels vertically
- **< 1024px**: Show a message to use the mobile app,
  or provide a simplified tablet layout

### 8. Page Architecture
Suggest a clear **page/route structure** for the dashboard:
/dashboard → Home / Overview
/dashboard/[feature-a] → Feature A main view
/dashboard/[feature-a]/[id] → Feature A detail
/dashboard/[feature-b] → Feature B main view
/dashboard/settings → Settings / Profile
/dashboard/notifications → Notification center
...map every mobile screen to a route



### 9. Assets & Tokens Consistency
- Reuse **the exact same design tokens** (colors, typography,
  spacing scale, border-radius, shadows) from the mobile app.
- Do not introduce any new color or font.
- If a new spacing value is needed (e.g., wider gutters),
  derive it from the existing scale.

## Deliverables
1. **Screen-by-screen mapping**: A table showing every mobile screen
   → its web dashboard equivalent layout.
2. **Sidebar navigation structure**: Full IA (Information Architecture)
   with icons, labels, groupings, and active states.
3. **Key page wireframes/layouts** described in detail:
   - Dashboard Home
   - Each major feature page
   - Detail / Edit views
   - Settings
4. **Component adaptation notes**: How each mobile component
   translates to web (with sizing, hover, and keyboard notes).
5. **Responsive behavior spec** for the dashboard at each breakpoint.
6. **Design token confirmation**: A checklist confirming no new
   colors, fonts, or off-brand values were introduced.
Quick Visual Summary

┌──────────────────────────────────────────────────┐
│  MOBILE APP (your current design)                │
│  ┌──────────┐                                    │
│  │  Screen 1│  ←─── same features ──→  ┌───────────────────────────┐
│  │  Screen 2│  ←─── same colors   ──→  │   WEB DASHBOARD           │
│  │  Screen 3│  ←─── same fonts    ──→  │ ┌────┬──────────────────┐ │
│  │  Screen 4│  ←─── same tokens   ──→  │ │Side│  Multi-panel     │ │
│  │    ...   │                           │ │bar │  layouts with    │ │
│  │  Tab Bar │  ←─── becomes       ──→  │ │nav │  higher density  │ │
│  └──────────┘                           │ └────┴──────────────────┘ │
│                                         └───────────────────────────┘
└──────────────────────────────────────────────────┘