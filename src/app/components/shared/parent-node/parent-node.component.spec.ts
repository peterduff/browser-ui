import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentNodeComponent } from './parent-node.component';

describe('ParentNodeComponent', () => {
  let component: ParentNodeComponent;
  let fixture: ComponentFixture<ParentNodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParentNodeComponent]
    });
    fixture = TestBed.createComponent(ParentNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
