import { TestBed } from '@angular/core/testing';

import { ActiveInquiriesService } from './active-inquiries.service';

describe('ActiveInquiriesService', () => {
  let service: ActiveInquiriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveInquiriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
