import { TestBed } from '@angular/core/testing';

import { InquiryDialogService } from './inquiry-dialog.service';

describe('InquiryDialogService', () => {
  let service: InquiryDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InquiryDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
