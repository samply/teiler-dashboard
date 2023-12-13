import { TestBed } from '@angular/core/testing';

import { FunctionTestsService } from './function-tests.service';

describe('FunctionTestsService', () => {
  let service: FunctionTestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FunctionTestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
