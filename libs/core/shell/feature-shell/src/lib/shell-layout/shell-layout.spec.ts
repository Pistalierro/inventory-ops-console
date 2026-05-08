jest.mock('@inventory-ops-console/core-shell-data-access', () => ({
  ShellStateService: class ShellStateService {},
}));

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { ShellStateService } from '@inventory-ops-console/core-shell-data-access';
import { ShellLayout } from './shell-layout';

describe('ShellLayout', () => {
  let component: ShellLayout;
  let fixture: ComponentFixture<ShellLayout>;
  let shellState: {
    isSigningOut: ReturnType<typeof signal<boolean>>;
    theme: ReturnType<typeof signal<'light' | 'dark'>>;
    displayName: ReturnType<typeof signal<string>>;
    email: ReturnType<typeof signal<string>>;
    roleLabel: ReturnType<typeof signal<string>>;
    toggleTheme: jest.Mock;
    signOut: jest.Mock;
  };

  beforeEach(async () => {
    shellState = {
      isSigningOut: signal(false),
      theme: signal('light'),
      displayName: signal('Pistaleiro'),
      email: signal('pistaleiro@gmail.com'),
      roleLabel: signal('Admin'),
      toggleTheme: jest.fn(),
      signOut: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ShellLayout],
      providers: [
        provideRouter([]),
        { provide: ShellStateService, useValue: shellState },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render router outlet for child routes', () => {
    const routerOutlet = fixture.debugElement.query((debugElement) =>
      debugElement.providerTokens.includes(RouterOutlet)
    );

    expect(routerOutlet).toBeTruthy();
  });

  it('should toggle mobile navigation drawer from topbar and drawer controls', () => {
    const menuButton = fixture.nativeElement.querySelector(
      'button[aria-label="Open navigation"]'
    ) as HTMLButtonElement;
    const drawer = fixture.nativeElement.querySelector(
      '.shell-layout__drawer'
    ) as HTMLElement;

    expect(drawer.classList.contains('shell-layout__drawer--open')).toBe(
      false
    );

    menuButton.click();
    fixture.detectChanges();

    expect(drawer.classList.contains('shell-layout__drawer--open')).toBe(true);

    const closeButton = fixture.nativeElement.querySelector(
      '.shell-layout__drawer button[aria-label="Close navigation"]'
    ) as HTMLButtonElement;

    closeButton.click();
    fixture.detectChanges();

    expect(drawer.classList.contains('shell-layout__drawer--open')).toBe(
      false
    );
  });

  it('should blur focused drawer control before hiding drawer from assistive technologies', () => {
    const menuButton = fixture.nativeElement.querySelector(
      'button[aria-label="Open navigation"]'
    ) as HTMLButtonElement;

    menuButton.click();
    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector(
      '.shell-layout__drawer button[aria-label="Close navigation"]'
    ) as HTMLButtonElement;

    closeButton.focus();
    expect(document.activeElement).toBe(closeButton);

    closeButton.click();
    fixture.detectChanges();

    expect(document.activeElement).not.toBe(closeButton);
  });
});
