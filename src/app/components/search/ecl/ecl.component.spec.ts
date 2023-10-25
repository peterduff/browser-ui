import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EclComponent } from './ecl.component';

describe('EclComponent', () => {
  let component: EclComponent;
  let fixture: ComponentFixture<EclComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EclComponent]
    });
    fixture = TestBed.createComponent(EclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
