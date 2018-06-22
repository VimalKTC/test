import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLogin } from './login.component';

describe('AppLogin', () => {
  let component: AppLogin;
  let fixture: ComponentFixture<AppLogin>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLogin ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
