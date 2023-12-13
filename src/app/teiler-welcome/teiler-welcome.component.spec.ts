import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilerWelcomeComponent } from './teiler-welcome.component';

describe('TeilerWelcomeComponent', () => {
  let component: TeilerWelcomeComponent;
  let fixture: ComponentFixture<TeilerWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeilerWelcomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeilerWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
