import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiInput } from './ui-input';

@Component({
  imports: [UiInput],
  template: `<input iocUiInput state="error" />`,
})
class TestHost {}

describe('UiInput', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('should apply base input class', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.classList.contains('ui-input')).toBe(true);
  });

  it('should apply error class and aria-invalid when state is error', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    expect(input.classList.contains('ui-input--error')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
