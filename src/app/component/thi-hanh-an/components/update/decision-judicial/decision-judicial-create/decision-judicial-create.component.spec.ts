import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionJudicialCreateComponent } from './decision-judicial-create.component';

describe('DecisionJudicialCreateComponent', () => {
  let component: DecisionJudicialCreateComponent;
  let fixture: ComponentFixture<DecisionJudicialCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionJudicialCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionJudicialCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
