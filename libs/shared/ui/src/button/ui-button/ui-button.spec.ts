import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  UiButton,
  UiButtonSize,
  UiButtonType,
  UiButtonVariant,
} from './ui-button';

@Component({
  imports: [UiButton],
  template: `
    <ioc-ui-button
      [variant]="variant"
      [size]="size"
      [type]="type"
      [disabled]="disabled"
      [iconOnly]="iconOnly"
      [ariaLabel]="ariaLabel"
    >
      @if (iconOnly) {
      <svg viewBox="0 0 24 24" aria-hidden="true"></svg>
      } @else { Save changes }
    </ioc-ui-button>
  `,
})
class TestHost {
  variant: UiButtonVariant = 'secondary';
  size: UiButtonSize = 'lg';
  type: UiButtonType = 'submit';
  disabled = true;
  iconOnly = false;
  ariaLabel: string | null = null;
}

describe('UiButton', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render projected content', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;

    expect(nativeElement.textContent).toContain('Save changes');
  });

  it('should apply variant and size classes to host', () => {
    const buttonHost: HTMLElement =
      fixture.nativeElement.querySelector('ioc-ui-button');

    expect(buttonHost.classList.contains('ui-button')).toBe(true);
    expect(buttonHost.classList.contains('ui-button--secondary')).toBe(true);
    expect(buttonHost.classList.contains('ui-button--lg')).toBe(true);
  });

  it('should pass type and disabled state to native button', () => {
    const nativeButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(nativeButton.type).toBe('submit');
    expect(nativeButton.disabled).toBe(true);
  });

  it('should support icon-only buttons with accessible label', () => {
    host.variant = 'ghost';
    host.size = 'sm';
    host.type = 'button';
    host.disabled = false;
    host.iconOnly = true;
    host.ariaLabel = 'Sign out';

    fixture.detectChanges();

    const buttonHost: HTMLElement =
      fixture.nativeElement.querySelector('ioc-ui-button');
    const nativeButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(buttonHost.classList.contains('ui-button--icon-only')).toBe(true);
    expect(buttonHost.classList.contains('ui-button--ghost')).toBe(true);
    expect(buttonHost.classList.contains('ui-button--sm')).toBe(true);
    expect(nativeButton.getAttribute('aria-label')).toBe('Sign out');
    expect(nativeButton.getAttribute('title')).toBe('Sign out');
  });
});
