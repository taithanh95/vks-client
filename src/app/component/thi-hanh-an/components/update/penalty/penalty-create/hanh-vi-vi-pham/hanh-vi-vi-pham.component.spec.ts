import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HanhViViPhamComponent } from './hanh-vi-vi-pham.component';

describe('HanhViViPhamComponent', () => {
  let component: HanhViViPhamComponent;
  let fixture: ComponentFixture<HanhViViPhamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HanhViViPhamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HanhViViPhamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
