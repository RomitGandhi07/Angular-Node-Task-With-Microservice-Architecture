import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialscustomComponent } from './initialscustom.component';

describe('InitialscustomComponent', () => {
  let component: InitialscustomComponent;
  let fixture: ComponentFixture<InitialscustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialscustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialscustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
