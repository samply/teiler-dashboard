import { TestBed } from '@angular/core/testing';

import { DialogQualiService } from './dialog-quali.service';

describe('DialogQualiService', () => {
  let service: DialogQualiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogQualiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
