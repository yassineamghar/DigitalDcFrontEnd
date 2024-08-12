import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommingsoonComponent } from './commingsoon.component';

describe('CommingsoonComponent', () => {
  let component: CommingsoonComponent;
  let fixture: ComponentFixture<CommingsoonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommingsoonComponent]
    });
    fixture = TestBed.createComponent(CommingsoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
