import { TestBed } from '@angular/core/testing';

import { TeilerConfigService } from './teiler-config.service';

describe('TeilerConfigService', () => {
  let service: TeilerConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeilerConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
