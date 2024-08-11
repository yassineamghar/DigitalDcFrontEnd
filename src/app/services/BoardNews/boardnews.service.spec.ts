import { TestBed } from '@angular/core/testing';

import { BoardnewsService } from './boardnews.service';

describe('BoardnewsService', () => {
  let service: BoardnewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardnewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
