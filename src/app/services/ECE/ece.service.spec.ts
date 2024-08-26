import { TestBed } from '@angular/core/testing';

import { EceService } from './ece.service';

describe('EceService', () => {
  let service: EceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
