import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellcustomComponent } from './cellcustom.component';

describe('CellcustomComponent', () => {
  let component: CellcustomComponent;
  let fixture: ComponentFixture<CellcustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellcustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellcustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
