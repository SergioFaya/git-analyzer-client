import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DisplayDashboardService } from './display-data.service';


describe('DisplayDataService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientModule],
	}));

	it('should be created', () => {
		const service: DisplayDashboardService = TestBed.get(DisplayDashboardService);
		expect(service).toBeTruthy();
	});
});
