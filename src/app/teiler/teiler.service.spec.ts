import { TestBed } from '@angular/core/testing';

import { TeilerService } from './teiler.service';

describe('TeilerService', () => {
  let service: TeilerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeilerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
