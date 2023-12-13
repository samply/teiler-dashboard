import { TestBed } from '@angular/core/testing';

import { DialogTestsService } from './dialog-tests.service';

describe('DialogTestsService', () => {
  let service: DialogTestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogTestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
