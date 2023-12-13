import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUploadsComponent } from './dialog-uploads.component';

describe('DialogUploadsComponent', () => {
  let component: DialogUploadsComponent;
  let fixture: ComponentFixture<DialogUploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUploadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
