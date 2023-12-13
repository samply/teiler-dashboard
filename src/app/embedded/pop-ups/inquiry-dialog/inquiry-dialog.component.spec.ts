import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryDialogComponent } from './inquiry-dialog.component';

describe('InquiryDialogComponent', () => {
  let component: InquiryDialogComponent;
  let fixture: ComponentFixture<InquiryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InquiryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
