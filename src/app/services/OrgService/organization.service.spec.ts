import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { OrganizationService } from './organization.service';


describe('OrganizationService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientModule],
	}));

	it('should be created', () => {
		const service: OrganizationService = TestBed.get(OrganizationService);
		expect(service).toBeTruthy();
	});
});
