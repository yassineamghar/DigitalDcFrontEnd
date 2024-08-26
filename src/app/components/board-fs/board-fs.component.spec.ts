import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardFSComponent } from './board-fs.component';

describe('BoardFSComponent', () => {
  let component: BoardFSComponent;
  let fixture: ComponentFixture<BoardFSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardFSComponent]
    });
    fixture = TestBed.createComponent(BoardFSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
