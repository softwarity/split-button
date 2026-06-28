# Release Notes

## NEXT RELEASE

### Fixes
- **Theming on Angular Material 17+**: migrated every button design token from the
  legacy `--mdc-*-button-*` names to the current `--mat-button-*` names — label and
  container colors, outline color, container shape (border-radius) and elevation
  shadow. Material no longer emits the `--mdc-*` tokens, so the directive previously
  fell through to its `--mat-sys-*` fallbacks and ignored any button-level
  customization coming from the Angular Material theme (e.g. `mat.button-overrides(...)`).
  The `--split-button-*` overrides and `--mat-sys-*` defaults are unaffected.
- **Auto-adapt inside a `mat-toolbar`**: the transparent variants (text, outlined)
  now fall back to `--mat-toolbar-container-text-color`, so their label and chevron
  pick up the toolbar's text color automatically — matching how a real `matButton`
  behaves. The container variants (filled, tonal, elevated) are unchanged (they keep
  their own label color over their own background).

### Docs
- README and demo documentation now describe the toolbar auto-adaptation behavior.
- Demo playground gains a contrasted `mat-toolbar` example (the split-button's label
  follows the toolbar text color) and carousel pickers for the `variant` and Material
  `palette` selectors.

### Chore
- Updated the dev/build toolchain to patched releases (Angular 21.2.x, Angular CDK/Material
  21.2.14) and pinned `undici`/`@babel/core` via npm `overrides`, clearing all high/moderate
  `npm audit` advisories. These are devDependencies only — the published package is unaffected
  (it ships nothing but `tslib` at runtime).

---

## 1.0.1

### Features
- Angular Material 3 split button directive with dropdown menu support
- 5 button variants: text (default), filled, tonal, outlined, elevated
- Auto-injected CSS styles (no manual style import required)
- Automatic menu positioning (`xPosition='before'` set automatically)
- Disabled state support
- Full keyboard navigation and ARIA accessibility
- Customizable theming via CSS custom properties and optional SCSS mixin

### Test Suite (Vitest)
32 comprehensive unit tests covering:

**Initialization (7 tests)**
- Directive creation
- Wrapper element with `.split-button` class
- Main button with `.split-button-main` class
- Chevron button creation
- SVG icon rendering
- Style injection into document head
- Single style injection (no duplicates)

**Variants (7 tests)**
- Default (text) variant has no variant class
- Filled variant adds `.split-button--filled`
- Tonal variant adds `.split-button--tonal`
- Outlined variant adds `.split-button--outlined`
- Elevated variant adds `.split-button--elevated`
- Variant class updates on change
- Variant class removal when switching to default

**Disabled State (4 tests)**
- Disabled class on wrapper
- Disabled attribute on chevron button
- Disabled class removal when re-enabled
- Disabled attribute removal when re-enabled

**Click Handling (2 tests)**
- Primary action triggers on main button click
- Primary action does not trigger on chevron click

**Menu Integration (6 tests)**
- Trigger element moved inside wrapper
- Wrapper position set to relative
- Menu xPosition automatically set to 'before'
- Menu opens on chevron click
- Menu does not open when disabled

**Chevron Button (3 tests)**
- Has `type="button"` attribute
- SVG has correct viewBox
- SVG has `fill="currentColor"`

**Without Trigger (2 tests)**
- Works without MatMenuTrigger
- Creates chevron button even without trigger

**CSS Variables (2 tests)**
- Injected styles contain CSS custom properties
- Includes hidden-trigger utility styles

---
