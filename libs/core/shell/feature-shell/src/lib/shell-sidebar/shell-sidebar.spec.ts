import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShellSidebar } from './shell-sidebar';

describe('ShellSidebar', () => {
  let component: ShellSidebar;
  let fixture: ComponentFixture<ShellSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShellSidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ShellSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render primary dashboard navigation', () => {
    const dashboardLink = fixture.nativeElement.querySelector(
      '.shell-sidebar__nav-link'
    ) as HTMLAnchorElement | null;

    expect(dashboardLink?.textContent).toContain('Dashboard');
  });

  it('should render upcoming navigation badges', () => {
    const badges = fixture.nativeElement.querySelectorAll('ioc-ui-badge');

    expect(badges.length).toBeGreaterThan(0);
    expect(badges[0].textContent).toContain('Soon');
  });
});
