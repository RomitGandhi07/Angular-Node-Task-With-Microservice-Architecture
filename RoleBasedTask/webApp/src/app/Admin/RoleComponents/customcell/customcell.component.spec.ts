import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomcellComponent } from './customcell.component';

describe('CustomcellComponent', () => {
  let component: CustomcellComponent;
  let fixture: ComponentFixture<CustomcellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomcellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomcellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
