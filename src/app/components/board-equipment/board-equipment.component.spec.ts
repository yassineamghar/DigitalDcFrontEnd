import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardEquipmentComponent } from './board-equipment.component';

describe('BoardEquipmentComponent', () => {
  let component: BoardEquipmentComponent;
  let fixture: ComponentFixture<BoardEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardEquipmentComponent]
    });
    fixture = TestBed.createComponent(BoardEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
