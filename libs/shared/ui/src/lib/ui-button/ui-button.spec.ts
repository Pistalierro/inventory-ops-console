import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiButton } from './ui-button';

@Component({
  imports: [UiButton],
  template: `
    <ioc-ui-button
      variant="secondary"
      size="lg"
      type="submit"
      [disabled]="true"
    >
      Save changes
    </ioc-ui-button>
  `,
})
class TestHost {}

describe('UiButton', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should render projected content', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;

    expect(nativeElement.textContent).toContain('Save changes');
  });

  it('should apply variant and size classes to host', () => {
    const buttonHost = fixture.nativeElement.querySelector('ioc-ui-button');

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
});
