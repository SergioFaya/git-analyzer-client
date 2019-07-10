import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RepoService } from './repo.service';

describe('RepoService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientModule],
	}));

	it('should be created', () => {
		const service: RepoService = TestBed.get(RepoService);
		expect(service).toBeTruthy();
	});
});
