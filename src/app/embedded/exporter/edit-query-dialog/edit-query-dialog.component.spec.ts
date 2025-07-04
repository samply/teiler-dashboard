import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQueryDialogComponent } from './edit-query-dialog.component';

describe('EditQueryDialogComponent', () => {
  let component: EditQueryDialogComponent;
  let fixture: ComponentFixture<EditQueryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQueryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditQueryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
