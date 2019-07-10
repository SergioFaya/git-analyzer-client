import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListReposUserComponent } from './list-repos-user.component';


describe('ListReposUserComponent', () => {
	let component: ListReposUserComponent;
	let fixture: ComponentFixture<ListReposUserComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ListReposUserComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ListReposUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

});
