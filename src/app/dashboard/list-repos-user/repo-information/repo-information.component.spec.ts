import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoInformationComponent } from './repo-information.component';

describe('RepoInformationComponent', () => {
  let component: RepoInformationComponent;
  let fixture: ComponentFixture<RepoInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepoInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
