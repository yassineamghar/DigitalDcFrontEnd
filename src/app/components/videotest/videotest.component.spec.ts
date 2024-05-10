import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideotestComponent } from './videotest.component';

describe('VideotestComponent', () => {
  let component: VideotestComponent;
  let fixture: ComponentFixture<VideotestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideotestComponent]
    });
    fixture = TestBed.createComponent(VideotestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
