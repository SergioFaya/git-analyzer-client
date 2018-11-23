import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavFullComponent } from './nav-full.component';

describe('NavFullComponent', () => {
  let component: NavFullComponent;
  let fixture: ComponentFixture<NavFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
