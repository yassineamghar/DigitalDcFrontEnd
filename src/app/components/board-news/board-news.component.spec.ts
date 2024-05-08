import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardNewsComponent } from './board-news.component';

describe('BoardNewsComponent', () => {
  let component: BoardNewsComponent;
  let fixture: ComponentFixture<BoardNewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardNewsComponent]
    });
    fixture = TestBed.createComponent(BoardNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
