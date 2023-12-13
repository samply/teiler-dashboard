import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogQualiComponent } from './dialog-quali.component';

describe('DialogQualiComponent', () => {
  let component: DialogQualiComponent;
  let fixture: ComponentFixture<DialogQualiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogQualiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogQualiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
