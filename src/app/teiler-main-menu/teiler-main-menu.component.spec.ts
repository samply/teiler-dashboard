import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilerMainMenuComponent } from './teiler-main-menu.component';

describe('TeilerMainMenuComponent', () => {
  let component: TeilerMainMenuComponent;
  let fixture: ComponentFixture<TeilerMainMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeilerMainMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeilerMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
