import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TeilerService } from '../teiler/teiler.service';
import { ColorSchemeService } from '../color-scheme.service';
import { RouteManagerService } from '../route/route-manager.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      providers: [
        provideRouter([]),
        ColorSchemeService,
        { provide: TeilerService, useValue: { teilerApps: [] } },
        { provide: RouteManagerService, useValue: { mainRouterLink: 'main' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the mobile menu', () => {
    expect(component.menuVisibleMobile).toBeFalse();
    component.toggleMenu();
    expect(component.menuVisibleMobile).toBeTrue();
  });
});
