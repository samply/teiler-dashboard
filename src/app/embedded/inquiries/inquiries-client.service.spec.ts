import { TestBed } from '@angular/core/testing';

import { InquiriesClientService } from './inquiries-client.service';

describe('InquiriesClientService', () => {
  let service: InquiriesClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InquiriesClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
