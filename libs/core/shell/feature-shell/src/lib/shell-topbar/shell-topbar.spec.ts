jest.mock('@inventory-ops-console/core-shell-data-access', () => ({
  ShellStateService: class ShellStateService {},
}));

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShellStateService } from '@inventory-ops-console/core-shell-data-access';
import { ShellTopbar } from './shell-topbar';

describe('ShellTopbar', () => {
  let component: ShellTopbar;
  let fixture: ComponentFixture<ShellTopbar>;
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
      imports: [ShellTopbar],
      providers: [
        provideRouter([]),
        { provide: ShellStateService, useValue: shellState },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellTopbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger theme toggle from topbar action', () => {
    const themeButton = fixture.nativeElement.querySelector(
      'button[aria-label="Use dark theme"]'
    ) as HTMLButtonElement;

    themeButton.click();

    expect(shellState.toggleTheme).toHaveBeenCalled();
  });

  it('should render current user summary', () => {
    expect(fixture.nativeElement.textContent).toContain('Pistaleiro');
    expect(fixture.nativeElement.textContent).toContain('pistaleiro@gmail.com');
    expect(fixture.nativeElement.textContent).toContain('Admin');
  });

  it('should trigger sign out from topbar action', () => {
    const signOutButton = fixture.nativeElement.querySelector(
      'button[aria-label="Sign out"]'
    ) as HTMLButtonElement;

    signOutButton.click();

    expect(shellState.signOut).toHaveBeenCalled();
  });
});
