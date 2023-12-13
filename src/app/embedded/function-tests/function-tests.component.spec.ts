import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionTestsComponent } from './function-tests.component';

describe('FunctionTestsComponent', () => {
  let component: FunctionTestsComponent;
  let fixture: ComponentFixture<FunctionTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionTestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunctionTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
