make the dark mode functional 
## Role
You are a senior product designer and design-system specialist who experts in theming, accessibility, and prototyping. You know and will use the provided brand color palette.

## Objective
Produce a comprehensive, design-first specification for dark mode that aligns with the existing brand and prototype. Output human-friendly design guidance, tokens, and assets suitable for designers and for a later developer handoff—no code implementation required unless requested.

## Assumptions
- The AI already has the brand's color palette and guidelines from the prototype.
- Deliverables should be usable directly in design tools (Figma/Sketch/Adobe XD) and easy to translate into CSS variables by developers later.

## Deliverables (Design-Only)
1. Color tokens (semantic, not raw colors):
   - Backgrounds: `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-tertiary`
   - Text: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
   - Borders: `--color-border-default`, `--color-border-subtle`
   - Surfaces: `--color-surface-elevated`, `--color-surface-overlay`
   - Accent: `--color-accent-primary`, `--color-accent-hover`, `--color-accent-active`
   - Semantics: `--color-semantic-success`, `--color-semantic-warning`, `--color-semantic-error`, `--color-semantic-info`
   - Shadows: `--color-shadow` (with opacity awareness)
   - Light and dark token sets, organized semantically (not by color name)
2. Thematic maps (two palettes):
   - `light` tokens
   - `dark` tokens
   - A short rationale for when to use each token in UI (buttons, surfaces, text, borders)
3. Typography and scales
   - Font tokens (sizes, weights, line-heights) for headings, body, captions
   - Link/interactive text styling and focus states
4. Component states (for the prototype)
   - Major components: buttons, inputs, selects, cards, modals, tooltips, nav items
   - States: default, hover, active, disabled, focus, selected
   - Visual patterns for dark mode (contrast, elevation, borders)
5. Imagery guidance
   - How icons/images should adapt (e.g., icons using currentColor, or a light/dark swap rule)
6. Accessibility and contrast
   - Contrast targets for normal and large text in both themes (WCAG AA)
   - Guidance on focus rings, color pairing, and readable UI on dark surfaces
7. Prototyping assets
   - Swatches in both themes (as PNG/SVG color swatches and a shared style guide)
   - Figma/Sketch/XD style names and tokens mapped to local styles
8. Handoff-ready notes
   - A concise map from design tokens to CSS variable names (for later dev handoff)
   - How to reference tokens in components and layouts
9. Prototyping constraints
   - Print styles (always light)
   - Motion guidance (when to animate theme switches)
   - Third-party components compatibility notes (if any)
10. Deliverables format
    - A design-spec doc (Markdown or your preferred design doc tool)
    - A tokens file placeholder (structure only, e.g., JSON/YAML/Figma styles)
    - A short style guide excerpt with do/don’t examples

## Output format (recommended)
- Start with a high-level summary of dark mode principles.
- Then present the token sets (light and dark) in a clean table or bullet list.
- Provide a visual reference section with swatches (light vs dark).
- Include a component-state appendix with visual references for major components.
- End with a quick handoff map from tokens to naming in design tools and a note on accessibility tests.

## Constraints
- Do not introduce raw code blocks unless requested for handoff; focus on design guidance and token nomenclature.
- Keep language clear and actionable for designers and for a later developer handoff.