import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  inject,
  HostBinding,
  booleanAttribute
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

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
export class SplitButtonDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  /** M3 button variant - empty string or no value means text button (lowest emphasis) */
  @Input() appSplitButton: '' | 'filled' | 'tonal' | 'outlined' | 'elevated' = '';

  /** MatMenuTrigger reference for the dropdown */
  @Input() appSplitButtonTrigger?: MatMenuTrigger;

  /** Whether the button is disabled */
  @Input({ transform: booleanAttribute }) disabled = false;

  @HostBinding('class.split-button-main') mainClass = true;

  private wrapper: HTMLElement | null = null;
  private chevronButton: HTMLButtonElement | null = null;
  private clickListener: (() => void) | null = null;

  ngAfterViewInit(): void {
    setTimeout(() => this.createSplitButton(), 0);
  }

  ngOnDestroy(): void {
    this.clickListener?.();
    if (this.wrapper && this.wrapper.parentNode) {
      const host = this.el.nativeElement;
      this.wrapper.parentNode.insertBefore(host, this.wrapper);
      this.wrapper.parentNode.removeChild(this.wrapper);
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

    // Add chevron SVG icon
    const svg = this.renderer.createElement('svg', 'svg');
    this.renderer.setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(svg, 'height', '24');
    this.renderer.setAttribute(svg, 'width', '24');
    this.renderer.setAttribute(svg, 'viewBox', '0 -960 960 960');
    this.renderer.setAttribute(svg, 'fill', 'currentColor');
    this.renderer.addClass(svg, 'split-button-icon');
    const path = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(path, 'd', 'M480-360 280-560h400L480-360Z');
    this.renderer.appendChild(svg, path);
    this.renderer.appendChild(this.chevronButton, svg);

    // Wrap the host element
    this.renderer.insertBefore(parent, this.wrapper, host);
    this.renderer.appendChild(this.wrapper, host);
    this.renderer.appendChild(this.wrapper, this.chevronButton);

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
