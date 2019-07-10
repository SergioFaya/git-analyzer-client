import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ChartService } from './chart.service';


describe('ChartService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientModule],
	}));

	it('should be created', () => {
		const service: ChartService = TestBed.get(ChartService);
		expect(service).toBeTruthy();
	});
});
