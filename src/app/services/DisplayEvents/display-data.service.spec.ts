import { TestBed } from '@angular/core/testing';
import { DisplayDashboardService } from './display-data.service';


describe('DisplayDataService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: DisplayDashboardService = TestBed.get(DisplayDashboardService);
		expect(service).toBeTruthy();
	});
});
