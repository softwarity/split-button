import { Component, CUSTOM_ELEMENTS_SCHEMA, computed, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SplitButtonDirective } from '@softwarity/split-button';
import { registerInteractiveCode } from '@softwarity/interactive-code';

registerInteractiveCode();

const PALETTES = [
  'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
  'orange', 'chartreuse', 'spring-green', 'azure', 'violet', 'rose'
] as const;

type SplitButtonVariant = '' | 'filled' | 'tonal' | 'outlined' | 'elevated';

@Component({
  imports: [
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    SplitButtonDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.scss'
})
export class PlaygroundComponent {
  private readonly snackBar = inject(MatSnackBar);

  // Dark mode
  protected isDarkMode = signal(document.body.classList.contains('dark-mode'));
  protected darkModeClass = computed(() => this.isDarkMode() ? 'dark-mode' : '');

  // Split button properties
  protected variant = signal<SplitButtonVariant>('');
  protected disabled = signal(false);

  // Palette
  protected selectedPalette = signal('violet');

  // Color overrides
  protected labelColorEnabled = signal(false);
  protected labelColorLight = signal('#6750a4');
  protected labelColorDark = signal('#ccc2dc');
  protected containerColorEnabled = signal(false);
  protected containerColorLight = signal('#6750a4');
  protected containerColorDark = signal('#4a4458');

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
      const labelEnabled = this.labelColorEnabled();
      const labelLight = this.labelColorLight();
      const labelDark = this.labelColorDark();
      const containerEnabled = this.containerColorEnabled();
      const containerLight = this.containerColorLight();
      const containerDark = this.containerColorDark();
      const variant = this.variant();

      if (labelEnabled || containerEnabled) {
        if (!this.styleElement) {
          this.styleElement = document.createElement('style');
          document.head.appendChild(this.styleElement);
        }
        const lines: string[] = [];

        // Apply based on variant
        const variantPrefix = variant ? `${variant}-` : 'text-';

        if (labelEnabled) {
          lines.push(`--split-button-${variantPrefix}label-color: light-dark(${labelLight}, ${labelDark});`);
        }
        if (containerEnabled && variant) {
          lines.push(`--split-button-${variantPrefix}container-color: light-dark(${containerLight}, ${containerDark});`);
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

  onPrimaryAction(): void {
    this.snackBar.open('Primary action executed', '', { duration: 2000 });
  }

  onMenuAction(action: string): void {
    this.snackBar.open(`Menu action: ${action}`, '', { duration: 2000 });
  }
}
