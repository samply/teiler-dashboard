import { TestBed } from '@angular/core/testing';

import { ArchivedInquiriesService } from './archived-inquiries.service';

describe('ArchivedInquiriesService', () => {
  let service: ArchivedInquiriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchivedInquiriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
