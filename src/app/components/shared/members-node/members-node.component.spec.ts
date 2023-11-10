import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersNodeComponent } from './members-node.component';

describe('MembersNodeComponent', () => {
  let component: MembersNodeComponent;
  let fixture: ComponentFixture<MembersNodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MembersNodeComponent]
    });
    fixture = TestBed.createComponent(MembersNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
