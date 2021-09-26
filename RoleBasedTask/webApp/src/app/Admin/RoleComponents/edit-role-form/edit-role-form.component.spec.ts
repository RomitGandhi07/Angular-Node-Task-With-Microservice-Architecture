import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleFormComponent } from './edit-role-form.component';

describe('EditRoleFormComponent', () => {
  let component: EditRoleFormComponent;
  let fixture: ComponentFixture<EditRoleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRoleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
