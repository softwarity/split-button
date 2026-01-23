import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SplitButtonDirective, SplitButtonVariant } from './split-button.directive';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

@Component({
  template: `
    <button
      [appSplitButton]="variant()"
      [appSplitButtonTrigger]="trigger"
      [disabled]="disabled()"
      (click)="onClick()">
      Test Button
    </button>
    <span class="hidden-trigger" [matMenuTriggerFor]="menu" #trigger="matMenuTrigger"></span>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="onMenuItemClick('option1')">Option 1</button>
      <button mat-menu-item (click)="onMenuItemClick('option2')">Option 2</button>
    </mat-menu>
  `,
  standalone: true,
  imports: [SplitButtonDirective, MatMenuModule]
})
class TestHostComponent {
  variant = signal<SplitButtonVariant>('');
  disabled = signal(false);
  clicked = false;
  menuItemClicked = '';

  onClick(): void {
    this.clicked = true;
  }

  onMenuItemClick(option: string): void {
    this.menuItemClicked = option;
  }
}

@Component({
  template: `
    <button appSplitButton>Simple Button</button>
  `,
  standalone: true,
  imports: [SplitButtonDirective]
})
class SimpleTestComponent {}

function wait(ms: number = 20): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('SplitButtonDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestHostComponent,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    const styleEl = document.getElementById('split-button-styles');
    if (styleEl) {
      styleEl.remove();
    }
  });

  describe('Initialization', () => {
    it('should create the directive', async () => {
      await wait();
      fixture.detectChanges();
      const buttonDebugElement = fixture.debugElement.query(By.directive(SplitButtonDirective));
      expect(buttonDebugElement).toBeTruthy();
    });

    it('should create a wrapper element with split-button class', async () => {
      await wait();
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper).toBeTruthy();
    });

    it('should add split-button-main class to host element', async () => {
      await wait();
      fixture.detectChanges();
      const mainButton = fixture.nativeElement.querySelector('.split-button-main');
      expect(mainButton).toBeTruthy();
      expect(mainButton.textContent).toContain('Test Button');
    });

    it('should create a chevron button', async () => {
      await wait();
      fixture.detectChanges();
      const chevronButton = fixture.nativeElement.querySelector('.split-button-chevron');
      expect(chevronButton).toBeTruthy();
    });

    it('should add SVG icon to chevron button', async () => {
      await wait();
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('.split-button-chevron svg');
      expect(svg).toBeTruthy();
      expect(svg.classList.contains('split-button-icon')).toBe(true);
    });

    it('should inject styles into document head', async () => {
      await wait();
      fixture.detectChanges();
      const styleEl = document.getElementById('split-button-styles');
      expect(styleEl).toBeTruthy();
      expect(styleEl?.tagName.toLowerCase()).toBe('style');
    });

    it('should only inject styles once', async () => {
      await wait();
      fixture.detectChanges();
      const styleElements = document.querySelectorAll('#split-button-styles');
      expect(styleElements.length).toBe(1);
    });
  });

  describe('Variants', () => {
    it('should not add variant class for default (text) variant', async () => {
      await wait();
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--filled')).toBe(false);
      expect(wrapper.classList.contains('split-button--tonal')).toBe(false);
      expect(wrapper.classList.contains('split-button--outlined')).toBe(false);
      expect(wrapper.classList.contains('split-button--elevated')).toBe(false);
    });

    it('should add split-button--filled class for filled variant', async () => {
      await wait();
      fixture.detectChanges();
      component.variant.set('filled');
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--filled')).toBe(true);
    });

    it('should add split-button--tonal class for tonal variant', async () => {
      await wait();
      fixture.detectChanges();
      component.variant.set('tonal');
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--tonal')).toBe(true);
    });

    it('should add split-button--outlined class for outlined variant', async () => {
      await wait();
      fixture.detectChanges();
      component.variant.set('outlined');
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--outlined')).toBe(true);
    });

    it('should add split-button--elevated class for elevated variant', async () => {
      await wait();
      fixture.detectChanges();
      component.variant.set('elevated');
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--elevated')).toBe(true);
    });

    it('should update variant class when variant changes', async () => {
      await wait();
      fixture.detectChanges();
      component.variant.set('filled');
      fixture.detectChanges();

      let wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--filled')).toBe(true);

      component.variant.set('outlined');
      fixture.detectChanges();

      wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--filled')).toBe(false);
      expect(wrapper.classList.contains('split-button--outlined')).toBe(true);
    });

    it('should remove variant class when changing to default', async () => {
      await wait();
      fixture.detectChanges();
      component.variant.set('filled');
      fixture.detectChanges();

      component.variant.set('');
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--filled')).toBe(false);
    });
  });

  describe('Disabled State', () => {
    it('should add split-button--disabled class when disabled', async () => {
      await wait();
      fixture.detectChanges();
      component.disabled.set(true);
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--disabled')).toBe(true);
    });

    it('should set disabled attribute on chevron button when disabled', async () => {
      await wait();
      fixture.detectChanges();
      component.disabled.set(true);
      fixture.detectChanges();
      const chevronButton = fixture.nativeElement.querySelector('.split-button-chevron');
      expect(chevronButton.hasAttribute('disabled')).toBe(true);
    });

    it('should remove disabled class when enabled', async () => {
      await wait();
      fixture.detectChanges();
      component.disabled.set(true);
      fixture.detectChanges();

      component.disabled.set(false);
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.classList.contains('split-button--disabled')).toBe(false);
    });

    it('should remove disabled attribute from chevron when enabled', async () => {
      await wait();
      fixture.detectChanges();
      component.disabled.set(true);
      fixture.detectChanges();

      component.disabled.set(false);
      fixture.detectChanges();

      const chevronButton = fixture.nativeElement.querySelector('.split-button-chevron');
      expect(chevronButton.hasAttribute('disabled')).toBe(false);
    });
  });

  describe('Click Handling', () => {
    it('should trigger primary action on main button click', async () => {
      await wait();
      fixture.detectChanges();
      const mainButton = fixture.nativeElement.querySelector('.split-button-main');
      mainButton.click();
      expect(component.clicked).toBe(true);
    });

    it('should not trigger primary action on chevron click', async () => {
      await wait();
      fixture.detectChanges();
      const chevronButton = fixture.nativeElement.querySelector('.split-button-chevron');
      chevronButton.click();
      expect(component.clicked).toBe(false);
    });
  });

  describe('Menu Integration', () => {
    it('should move trigger element inside wrapper', async () => {
      await wait();
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.split-button');
      const trigger = wrapper.querySelector('.hidden-trigger');
      expect(trigger).toBeTruthy();
    });

    it('should set wrapper position to relative', async () => {
      await wait();
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.split-button');
      expect(wrapper.style.position).toBe('relative');
    });

    it('should configure menu xPosition to before', async () => {
      await wait();
      fixture.detectChanges();
      const triggerDebug = fixture.debugElement.query(By.directive(MatMenuTrigger));
      const trigger = triggerDebug.injector.get(MatMenuTrigger);
      expect(trigger.menu?.xPosition).toBe('before');
    });

    it('should open menu when chevron is clicked', async () => {
      await wait();
      fixture.detectChanges();

      const triggerDebug = fixture.debugElement.query(By.directive(MatMenuTrigger));
      const trigger = triggerDebug.injector.get(MatMenuTrigger);

      expect(trigger.menuOpen).toBe(false);

      const chevronButton = fixture.nativeElement.querySelector('.split-button-chevron');
      chevronButton.click();
      fixture.detectChanges();

      expect(trigger.menuOpen).toBe(true);
    });

    it('should not open menu when disabled', async () => {
      await wait();
      fixture.detectChanges();
      component.disabled.set(true);
      fixture.detectChanges();

      const triggerDebug = fixture.debugElement.query(By.directive(MatMenuTrigger));
      const trigger = triggerDebug.injector.get(MatMenuTrigger);

      const chevronButton = fixture.nativeElement.querySelector('.split-button-chevron');
      chevronButton.click();
      fixture.detectChanges();
      await wait();

      expect(trigger.menuOpen).toBe(false);
    });
  });

  describe('Chevron Button', () => {
    it('should have type="button" attribute', async () => {
      await wait();
      fixture.detectChanges();
      const chevronButton = fixture.nativeElement.querySelector('.split-button-chevron');
      expect(chevronButton.getAttribute('type')).toBe('button');
    });

    it('should contain SVG with correct viewBox', async () => {
      await wait();
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('.split-button-chevron svg');
      expect(svg.getAttribute('viewBox')).toBe('0 -960 960 960');
    });

    it('should have fill="currentColor" on SVG', async () => {
      await wait();
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('.split-button-chevron svg');
      expect(svg.getAttribute('fill')).toBe('currentColor');
    });
  });
});

describe('SplitButtonDirective without trigger', () => {
  let fixture: ComponentFixture<SimpleTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleTestComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleTestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    const styleEl = document.getElementById('split-button-styles');
    if (styleEl) {
      styleEl.remove();
    }
  });

  it('should work without MatMenuTrigger', async () => {
    await wait();
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('.split-button');
    expect(wrapper).toBeTruthy();
  });

  it('should create chevron button even without trigger', async () => {
    await wait();
    fixture.detectChanges();
    const chevronButton = fixture.nativeElement.querySelector('.split-button-chevron');
    expect(chevronButton).toBeTruthy();
  });
});

describe('SplitButtonDirective CSS Variables', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    const styleEl = document.getElementById('split-button-styles');
    if (styleEl) {
      styleEl.remove();
    }
  });

  it('should inject styles with CSS custom properties', async () => {
    await wait();
    fixture.detectChanges();
    const styleEl = document.getElementById('split-button-styles');
    const styleContent = styleEl?.textContent || '';

    expect(styleContent).toContain('--split-button-container-shape');
    expect(styleContent).toContain('--split-button-text-label-color');
    expect(styleContent).toContain('--split-button-filled-container-color');
    expect(styleContent).toContain('--split-button-filled-label-color');
    expect(styleContent).toContain('--split-button-outlined-outline-color');
    expect(styleContent).toContain('--split-button-tonal-container-color');
    expect(styleContent).toContain('--split-button-elevated-container-color');
    expect(styleContent).toContain('--split-button-disabled-opacity');
  });

  it('should include hidden-trigger styles', async () => {
    await wait();
    fixture.detectChanges();
    const styleEl = document.getElementById('split-button-styles');
    const styleContent = styleEl?.textContent || '';

    expect(styleContent).toContain('.hidden-trigger');
    expect(styleContent).toContain('visibility: hidden');
    expect(styleContent).toContain('pointer-events: none');
  });
});
