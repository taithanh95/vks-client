import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabVerifyComponent } from './tab-verify.component';

describe('TabVerifyComponent', () => {
  let component: TabVerifyComponent;
  let fixture: ComponentFixture<TabVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
