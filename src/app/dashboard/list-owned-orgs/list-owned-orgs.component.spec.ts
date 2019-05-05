import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOwnedOrgsComponent } from './list-owned-orgs.component';

describe('ListOwnedOrgsComponent', () => {
  let component: ListOwnedOrgsComponent;
  let fixture: ComponentFixture<ListOwnedOrgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOwnedOrgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOwnedOrgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
