import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefsetsComponent } from './refsets.component';

describe('RefsetComponent', () => {
  let component: RefsetsComponent;
  let fixture: ComponentFixture<RefsetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefsetsComponent]
    });
    fixture = TestBed.createComponent(RefsetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
