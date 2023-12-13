import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeilerBoxComponent } from './teiler-box.component';

describe('TeilerBoxComponent', () => {
  let component: TeilerBoxComponent;
  let fixture: ComponentFixture<TeilerBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeilerBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeilerBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
