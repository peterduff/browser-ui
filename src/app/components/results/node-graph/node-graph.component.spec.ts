import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeGraphComponent } from './node-graph.component';

describe('NodeGraphComponent', () => {
  let component: NodeGraphComponent;
  let fixture: ComponentFixture<NodeGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeGraphComponent]
    });
    fixture = TestBed.createComponent(NodeGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
