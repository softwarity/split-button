<p align="center">
  <a href="https://www.softwarity.io/">
    <img src="https://www.softwarity.io/img/softwarity.svg" alt="Softwarity" height="60">
  </a>
</p>

# @softwarity/loading-indicator

<p align="center">
  <a href="https://www.npmjs.com/package/@softwarity/loading-indicator">
    <img src="https://img.shields.io/npm/v/@softwarity/loading-indicator?color=blue&label=npm" alt="npm version">
  </a>
  <a href="https://github.com/softwarity/loading-indicator/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="license">
  </a>
  <a href="https://github.com/softwarity/loading-indicator/actions/workflows/main.yml">
    <img src="https://github.com/softwarity/loading-indicator/actions/workflows/main.yml/badge.svg" alt="build status">
  </a>
</p>

An Angular component that displays an expressive [Material 3 loading indicator](https://m3.material.io/components/loading-indicator/overview) with smooth morphing animation between organic shapes.

**[Live Demo](https://softwarity.github.io/loading-indicator/)** | **[Release Notes](RELEASE_NOTES.md)**

<p align="center">
  <a href="https://softwarity.github.io/loading-indicator/">
    <img src="projects/demo/src/assets/preview.png" alt="Loading Indicator Preview" width="400">
  </a>
</p>

## Features

- **Material 3 Expressive Design** - Smooth morphing animation between 7 organic shapes
- **60fps Animation** - Uses requestAnimationFrame for butter-smooth performance
- **Responsive to Theme** - Automatically adapts to light/dark color schemes
- **Customizable Size** - Adjustable diameter from small to large
- **Optional Container** - Circular background for better visibility
- **Material 3 Ready** - Uses M3 design tokens for theming (`--mat-sys-*`)
- **Standalone Component** - Easy to import in any Angular 21+ application
- **Lightweight** - Pure SVG animation, no external dependencies

## Installation

```bash
npm install @softwarity/loading-indicator
```

### Peer Dependencies

| Package | Version |
|---------|---------|
| @angular/core | >= 21.0.0 |

## Usage

Import the component in your standalone component:

```typescript
import { LoadingIndicatorComponent } from '@softwarity/loading-indicator';

@Component({
  selector: 'app-my-component',
  imports: [LoadingIndicatorComponent],
  template: `...`
})
export class MyComponent {}
```

Add the `loading-indicator` component in your template:

```html
<!-- Basic usage -->
<loading-indicator />

<!-- With custom diameter -->
<loading-indicator [diameter]="96" />

<!-- With container background -->
<loading-indicator withContainer />

<!-- Combined -->
<loading-indicator [diameter]="64" withContainer />
```

## API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `diameter` | `number` | `48` | Size of the loading indicator in pixels |
| `withContainer` | `boolean` | `false` | When true, displays a circular background container behind the shape |

## Theming (Material 3)

The component provides a SCSS mixin to customize the colors. This approach follows Angular Material's theming pattern.

### Setup

In your application's `styles.scss`, import the theme file and call the `overrides` mixin:

```scss
@use '@angular/material' as mat;
@use '@softwarity/loading-indicator/loading-indicator-theme' as loading-indicator;

// Your Material 3 theme
html {
  @include mat.theme((
    color: (
      primary: mat.$violet-palette,
      tertiary: mat.$yellow-palette
    )
  ));

  // Optional: customize loading indicator colors
  // @include loading-indicator.overrides();
}
```

### Customization

The `overrides` mixin accepts a map of tokens to customize the appearance:

| Token | Default | Description |
|-------|---------|-------------|
| `background-color` | `var(--mat-sys-primary-container)` | Background color when withContainer is true |
| `shape-color` | `var(--mat-sys-on-secondary-container)` | Color of the animated shape |

### Examples

```scss
// Customize colors with light/dark support
@include loading-indicator.overrides((
  background-color: light-dark(#e8def8, #4a4458),
  shape-color: light-dark(#6750a4, #ccc2dc)
));

// Use Material 3 system colors
@include loading-indicator.overrides((
  background-color: var(--mat-sys-tertiary-container),
  shape-color: var(--mat-sys-on-tertiary-container)
));

// Custom brand colors
@include loading-indicator.overrides((
  shape-color: #ff5722
));
```

## Examples

### Centered Overlay

```html
<div class="loading-overlay">
  <loading-indicator [diameter]="64" withContainer />
</div>
```

### Inline Button Loading

```html
<button [disabled]="isLoading">
  @if (isLoading) {
    <loading-indicator [diameter]="24" />
  } @else {
    Submit
  }
</button>
```

### Content Placeholder

```html
@if (isLoading) {
  <loading-indicator [diameter]="48" />
} @else {
  <app-content />
}
```

### With Deferred Loading

```html
@defer (on idle) {
  <app-heavy-component />
} @placeholder (minimum 500ms) {
  <loading-indicator [diameter]="64" withContainer />
}
```

## License

MIT
