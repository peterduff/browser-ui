import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefsetComponent } from './refset.component';

describe('RefsetsComponent', () => {
  let component: RefsetComponent;
  let fixture: ComponentFixture<RefsetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RefsetComponent]
    });
    fixture = TestBed.createComponent(RefsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
