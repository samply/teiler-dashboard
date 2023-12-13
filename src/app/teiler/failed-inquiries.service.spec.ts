import { TestBed } from '@angular/core/testing';

import { FailedInquiriesService } from './failed-inquiries.service';

describe('ErrorInquiriesService', () => {
  let service: FailedInquiriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FailedInquiriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
