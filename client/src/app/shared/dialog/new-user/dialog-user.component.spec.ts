import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNewUserComponent } from './dialog-new-user.component';

describe('DialogEditUserComponent', () => {
  let component: DialogNewUserComponent;
  let fixture: ComponentFixture<DialogNewUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogNewUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
