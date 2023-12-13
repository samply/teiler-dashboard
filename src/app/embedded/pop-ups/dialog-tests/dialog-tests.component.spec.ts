import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTestsComponent } from './dialog-tests.component';

describe('DialogTestsComponent', () => {
  let component: DialogTestsComponent;
  let fixture: ComponentFixture<DialogTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
