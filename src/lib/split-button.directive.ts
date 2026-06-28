import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  inject,
  HostBinding,
  booleanAttribute
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';

/** M3 Button variant type */
export type SplitButtonVariant = '' | 'filled' | 'tonal' | 'outlined' | 'elevated';

const VARIANT_CLASSES = ['split-button--filled', 'split-button--tonal', 'split-button--outlined', 'split-button--elevated'];

const STYLE_ID = 'split-button-styles';

/**
 * Injects styles into the document head (only once).
 *
 * Color strategy (mirrors how a real `matButton` behaves):
 * - Tokens use the Angular Material v17+ `--mat-button-*` names. The legacy
 *   `--mdc-*` names are no longer emitted by Material, so reading them always
 *   fell through to the `--mat-sys-*` fallback and never picked up the theme.
 * - The "transparent" variants (text, outlined) add `--mat-toolbar-container-text-color`
 *   to their fallback chain so their label/chevron auto-adapt to a `mat-toolbar`'s
 *   text color — Material remaps the same token for its own buttons, but only on
 *   `.mat-mdc-button-base.mat-unthemed` elements (which this directive's wrapper
 *   is not), so we inherit the toolbar token directly instead.
 * - The "container" variants (filled, tonal, elevated) keep their own label color;
 *   they sit on their own background and must not follow the container's text color.
 */
function injectStyles(doc: Document): void {
  if (doc.getElementById(STYLE_ID)) return;

  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .split-button {
      display: inline-flex;
      align-items: stretch;
      border-radius: var(--split-button-container-shape, var(--mat-button-outlined-container-shape, 20px));
      overflow: hidden;
      vertical-align: middle;
      height: 40px;
    }
    .split-button .split-button-main {
      border: none;
      background: transparent;
      border-radius: 0;
      border-top-left-radius: var(--split-button-container-shape, var(--mat-button-outlined-container-shape, 20px));
      border-bottom-left-radius: var(--split-button-container-shape, var(--mat-button-outlined-container-shape, 20px));
      min-width: unset;
      padding: 0 16px 0 24px;
      height: 40px;
      font-family: var(--mat-sys-label-large-font);
      font-size: var(--mat-sys-label-large-size, 14px);
      font-weight: var(--mat-sys-label-large-weight, 500);
      letter-spacing: var(--mat-sys-label-large-tracking, 0.1px);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--split-button-text-label-color, var(--mat-button-text-label-text-color, var(--mat-toolbar-container-text-color, var(--mat-sys-primary))));
    }
    .split-button .split-button-main:hover {
      background: color-mix(in srgb, var(--mat-sys-primary) 8%, transparent);
    }
    .split-button .split-button-chevron {
      all: unset;
      box-sizing: border-box;
      border: none;
      background: transparent;
      border-radius: 0;
      border-top-right-radius: var(--split-button-container-shape, var(--mat-button-outlined-container-shape, 20px));
      border-bottom-right-radius: var(--split-button-container-shape, var(--mat-button-outlined-container-shape, 20px));
      width: 40px;
      min-width: 40px;
      max-width: 40px;
      padding: 0;
      margin: 0;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      flex-shrink: 0;
      color: var(--split-button-text-label-color, var(--mat-button-text-label-text-color, var(--mat-toolbar-container-text-color, var(--mat-sys-primary))));
    }
    .split-button .split-button-chevron:hover {
      background: color-mix(in srgb, currentColor 8%, transparent);
    }
    .split-button .split-button-chevron:focus-visible {
      outline: 2px solid var(--mat-sys-primary);
      outline-offset: -2px;
    }
    .split-button .split-button-icon {
      width: 24px;
      height: 24px;
      display: block;
    }
    /* Outlined variant */
    .split-button.split-button--outlined {
      border: 1px solid var(--split-button-outlined-outline-color, var(--mat-button-outlined-outline-color, var(--mat-sys-outline)));
    }
    .split-button.split-button--outlined .split-button-main {
      color: var(--split-button-outlined-label-color, var(--mat-button-outlined-label-text-color, var(--mat-toolbar-container-text-color, var(--mat-sys-primary))));
    }
    .split-button.split-button--outlined .split-button-chevron {
      border-left: 1px solid var(--split-button-outlined-outline-color, var(--mat-button-outlined-outline-color, var(--mat-sys-outline)));
      color: var(--split-button-outlined-label-color, var(--mat-button-outlined-label-text-color, var(--mat-toolbar-container-text-color, var(--mat-sys-primary))));
    }
    /* Elevated variant */
    .split-button.split-button--elevated {
      box-shadow: var(--split-button-elevated-shadow, var(--mat-button-protected-container-elevation-shadow, 0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)));
      background: var(--split-button-elevated-container-color, var(--mat-button-protected-container-color, var(--mat-sys-surface-container-low)));
    }
    .split-button.split-button--elevated .split-button-main {
      color: var(--split-button-elevated-label-color, var(--mat-button-protected-label-text-color, var(--mat-sys-primary)));
      position: relative;
    }
    .split-button.split-button--elevated .split-button-main::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background: currentColor;
      opacity: 0.2;
    }
    .split-button.split-button--elevated .split-button-chevron {
      color: var(--split-button-elevated-label-color, var(--mat-button-protected-label-text-color, var(--mat-sys-primary)));
    }
    /* Filled variant */
    .split-button.split-button--filled {
      background: var(--split-button-filled-container-color, var(--mat-button-filled-container-color, var(--mat-sys-primary)));
    }
    .split-button.split-button--filled .split-button-main {
      color: var(--split-button-filled-label-color, var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary)));
      position: relative;
    }
    .split-button.split-button--filled .split-button-main::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background: currentColor;
      opacity: 0.2;
    }
    .split-button.split-button--filled .split-button-main:hover {
      background: color-mix(in srgb, var(--mat-sys-on-primary) 8%, transparent);
    }
    .split-button.split-button--filled .split-button-chevron {
      color: var(--split-button-filled-label-color, var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary)));
    }
    /* Tonal variant */
    .split-button.split-button--tonal {
      background: var(--split-button-tonal-container-color, var(--mat-sys-secondary-container));
    }
    .split-button.split-button--tonal .split-button-main {
      color: var(--split-button-tonal-label-color, var(--mat-sys-on-secondary-container));
      position: relative;
    }
    .split-button.split-button--tonal .split-button-main::after {
      content: '';
      position: absolute;
      right: 0;
      top: 20%;
      height: 60%;
      width: 1px;
      background: currentColor;
      opacity: 0.2;
    }
    .split-button.split-button--tonal .split-button-main:hover {
      background: color-mix(in srgb, var(--mat-sys-on-secondary-container) 8%, transparent);
    }
    .split-button.split-button--tonal .split-button-chevron {
      color: var(--split-button-tonal-label-color, var(--mat-sys-on-secondary-container));
    }
    /* Disabled state */
    .split-button.split-button--disabled {
      pointer-events: none;
      opacity: var(--split-button-disabled-opacity, 0.38);
    }
    /* Hidden trigger utility - covers full height at right edge for proper menu alignment in both directions */
    .split-button > .hidden-trigger {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 1px;
      height: 100%;
      visibility: hidden;
      pointer-events: none;
    }
  `;
  doc.head.appendChild(style);
}

/**
 * Split button directive that transforms a button into a split button with dropdown.
 * Follows Material Design 3 guidelines.
 *
 * Usage:
 * ```html
 * <button appSplitButton [appSplitButtonTrigger]="trigger" (click)="doAction()">
 *   Text button (default)
 * </button>
 * <button appSplitButton="filled" [appSplitButtonTrigger]="trigger" (click)="doAction()">
 *   Filled button
 * </button>
 * <span [matMenuTriggerFor]="menu" #trigger="matMenuTrigger"></span>
 * <mat-menu #menu="matMenu">
 *   <button mat-menu-item>Option 1</button>
 * </mat-menu>
 * ```
 *
 * M3 Button Variants:
 * - (no value): Text button - lowest emphasis
 * - filled: High emphasis
 * - tonal: Medium emphasis with container color
 * - outlined: Medium emphasis with border
 * - elevated: Medium emphasis with shadow
 */
@Directive({
  selector: '[appSplitButton]',
  standalone: true
})
export class SplitButtonDirective implements AfterViewInit, OnDestroy, OnChanges {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  /** M3 button variant - empty string or no value means text button (lowest emphasis) */
  @Input() appSplitButton: SplitButtonVariant = '';

  /** MatMenuTrigger reference for the dropdown */
  @Input() appSplitButtonTrigger?: MatMenuTrigger;

  /** Whether the button is disabled */
  @Input({ transform: booleanAttribute }) disabled = false;

  @HostBinding('class.split-button-main') mainClass = true;

  private wrapper: HTMLElement | null = null;
  private chevronButton: HTMLButtonElement | null = null;
  private clickListener: (() => void) | null = null;
  private initialized = false;

  ngAfterViewInit(): void {
    injectStyles(this.document);
    setTimeout(() => {
      this.createSplitButton();
      this.initialized = true;
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized || !this.wrapper) return;

    // Handle variant changes
    if (changes['appSplitButton']) {
      this.updateVariantClass();
    }

    // Handle disabled changes
    if (changes['disabled']) {
      this.updateDisabledState();
    }
  }

  ngOnDestroy(): void {
    this.clickListener?.();
    if (this.wrapper && this.wrapper.parentNode) {
      const host = this.el.nativeElement;
      this.wrapper.parentNode.insertBefore(host, this.wrapper);
      this.wrapper.parentNode.removeChild(this.wrapper);
    }
  }

  private updateVariantClass(): void {
    if (!this.wrapper) return;

    // Remove all variant classes
    VARIANT_CLASSES.forEach(cls => {
      this.renderer.removeClass(this.wrapper, cls);
    });

    // Add new variant class if specified
    if (this.appSplitButton) {
      this.renderer.addClass(this.wrapper, `split-button--${this.appSplitButton}`);
    }
  }

  private updateDisabledState(): void {
    if (!this.wrapper || !this.chevronButton) return;

    if (this.disabled) {
      this.renderer.addClass(this.wrapper, 'split-button--disabled');
      this.renderer.setAttribute(this.chevronButton, 'disabled', 'true');
    } else {
      this.renderer.removeClass(this.wrapper, 'split-button--disabled');
      this.renderer.removeAttribute(this.chevronButton, 'disabled');
    }
  }

  private createSplitButton(): void {
    const host = this.el.nativeElement as HTMLElement;
    const parent = host.parentNode;
    if (!parent) return;

    // Create wrapper
    this.wrapper = this.renderer.createElement('div');
    this.renderer.addClass(this.wrapper, 'split-button');

    // Only add variant class if a variant is specified (otherwise it's text/default)
    if (this.appSplitButton) {
      this.renderer.addClass(this.wrapper, `split-button--${this.appSplitButton}`);
    }

    if (this.disabled) {
      this.renderer.addClass(this.wrapper, 'split-button--disabled');
    }

    // Create chevron button
    this.chevronButton = this.renderer.createElement('button');
    this.renderer.setAttribute(this.chevronButton, 'type', 'button');
    this.renderer.addClass(this.chevronButton, 'split-button-chevron');

    if (this.disabled) {
      this.renderer.setAttribute(this.chevronButton, 'disabled', 'true');
    }

    // Add chevron SVG icon using innerHTML for proper namespace handling
    this.chevronButton!.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -960 960 960" fill="currentColor" class="split-button-icon">
        <path d="M480-360 280-560h400L480-360Z"/>
      </svg>
    `;

    // Wrap the host element
    this.renderer.insertBefore(parent, this.wrapper, host);
    this.renderer.appendChild(this.wrapper, host);
    this.renderer.appendChild(this.wrapper, this.chevronButton);

    // Move the trigger element inside the wrapper for proper menu alignment (below the full button)
    if (this.appSplitButtonTrigger) {
      const triggerEl = (this.appSplitButtonTrigger as any)._element?.nativeElement;
      if (triggerEl) {
        this.renderer.setStyle(this.wrapper, 'position', 'relative');
        this.renderer.appendChild(this.wrapper, triggerEl);
      }
      // Configure menu position so it aligns with the left edge of the split button
      const menu = this.appSplitButtonTrigger.menu;
      if (menu) {
        menu.xPosition = 'before';
      }
    }

    // Setup click handler for chevron - opens the menu via the trigger
    this.clickListener = this.renderer.listen(this.chevronButton, 'click', (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.appSplitButtonTrigger && !this.disabled) {
        this.appSplitButtonTrigger.openMenu();
      }
    });
  }
}
