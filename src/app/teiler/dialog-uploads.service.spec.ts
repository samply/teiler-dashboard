import { TestBed } from '@angular/core/testing';

import { DialogUploadsService } from './dialog-uploads.service';

describe('DialogUploadsService', () => {
  let service: DialogUploadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogUploadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
