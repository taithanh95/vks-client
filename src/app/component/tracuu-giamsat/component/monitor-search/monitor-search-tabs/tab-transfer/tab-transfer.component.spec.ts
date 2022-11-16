import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabTransferComponent } from './tab-transfer.component';

describe('TabTransferComponent', () => {
  let component: TabTransferComponent;
  let fixture: ComponentFixture<TabTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
