import { TestBed } from '@angular/core/testing';

import { TeilerAuthService } from './teiler-auth.service';

describe('TeilerAuthService', () => {
  let service: TeilerAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeilerAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
