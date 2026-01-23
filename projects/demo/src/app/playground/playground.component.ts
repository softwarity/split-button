import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, effect, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LoadingIndicatorComponent } from '@softwarity/loading-indicator';
import { registerInteractiveCode } from '@softwarity/interactive-code';

registerInteractiveCode();

const PALETTES = [
  'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
  'orange', 'chartreuse', 'spring-green', 'azure', 'violet', 'rose'
] as const;

@Component({
  imports: [
    MatIconModule,
    LoadingIndicatorComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss'
})
export class PlaygroundComponent {
  // Dark mode
  protected isDarkMode = signal(document.body.classList.contains('dark-mode'));
  protected darkModeClass = computed(() => this.isDarkMode() ? 'dark-mode' : '');

  // Component properties
  protected diameter = signal(64);
  protected withContainer = signal(false);

  // Palette
  protected selectedPalette = signal('violet');

  // Color overrides
  protected bgEnabled = signal(false);
  protected bgLight = signal('#e8def8');
  protected bgDark = signal('#4a4458');
  protected shapeEnabled = signal(false);
  protected shapeLight = signal('#6750a4');
  protected shapeDark = signal('#ccc2dc');

  private styleElement: HTMLStyleElement | null = null;

  constructor() {
    // Apply palette changes
    effect(() => {
      const palette = this.selectedPalette();
      const html = document.documentElement;
      PALETTES.forEach(p => html.classList.remove(p));
      if (palette && palette !== 'violet') {
        html.classList.add(palette);
      }
    });

    // Apply CSS variables when color overrides change
    effect(() => {
      const bgEnabled = this.bgEnabled();
      const bgLight = this.bgLight();
      const bgDark = this.bgDark();
      const shapeEnabled = this.shapeEnabled();
      const shapeLight = this.shapeLight();
      const shapeDark = this.shapeDark();

      if (bgEnabled || shapeEnabled) {
        if (!this.styleElement) {
          this.styleElement = document.createElement('style');
          document.head.appendChild(this.styleElement);
        }
        const lines: string[] = [];
        if (bgEnabled) {
          lines.push(`--loading-indicator-background-color: light-dark(${bgLight}, ${bgDark});`);
        }
        if (shapeEnabled) {
          lines.push(`--loading-indicator-shape-color: light-dark(${shapeLight}, ${shapeDark});`);
        }
        this.styleElement.textContent = `:root { ${lines.join(' ')} }`;
      } else if (this.styleElement) {
        this.styleElement.remove();
        this.styleElement = null;
      }
    });
  }

  toggleColorScheme(): void {
    this.isDarkMode.update(dark => !dark);
    document.body.classList.toggle('dark-mode', this.isDarkMode());
  }
}
