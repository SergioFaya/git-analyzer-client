import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RecentActivityService } from './recent-activity.service';

describe('RecentActivityService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientModule],
	}));

	it('should be created', () => {
		const service: RecentActivityService = TestBed.get(RecentActivityService);
		expect(service).toBeTruthy();
	});
});
