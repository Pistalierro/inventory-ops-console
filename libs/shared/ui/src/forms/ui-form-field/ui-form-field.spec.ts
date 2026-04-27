import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiFormField } from './ui-form-field';

@Component({
  imports: [UiFormField],
  template: `
    <ioc-ui-form-field
      label="Email"
      hint="Use your company email"
      state="error"
      [required]="true"
    >
      <input type="email" />
      <span error>Enter a valid email address.</span>
    </ioc-ui-form-field>
  `,
})
class TestHost {}

describe('UiFormField', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should render label, required marker, hint, projected control and error content', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;

    expect(nativeElement.textContent).toContain('Email');
    expect(nativeElement.textContent).toContain('*');
    expect(nativeElement.textContent).toContain('Use your company email');
    expect(nativeElement.querySelector('input[type="email"]')).toBeTruthy();
    expect(nativeElement.textContent).toContain('Enter a valid email address.');
  });

  it('should project error content into the error container', () => {
    const errorContainer: HTMLElement | null =
      fixture.nativeElement.querySelector('.ui-form-field__error');

    expect(errorContainer).toBeTruthy();
    expect(errorContainer?.textContent).toContain(
      'Enter a valid email address.'
    );
  });

  it('should apply error state class', () => {
    const formField = fixture.nativeElement.querySelector('ioc-ui-form-field');

    expect(formField.classList.contains('ui-form-field--error')).toBe(true);
  });
});
