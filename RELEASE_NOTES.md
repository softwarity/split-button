# Release Notes

## 1.0.2

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

