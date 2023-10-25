import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptUtilityBarComponent } from './concept-utility-bar.component';

describe('ConceptUtilityBarComponent', () => {
  let component: ConceptUtilityBarComponent;
  let fixture: ComponentFixture<ConceptUtilityBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptUtilityBarComponent]
    });
    fixture = TestBed.createComponent(ConceptUtilityBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
