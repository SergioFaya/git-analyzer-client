import { TestBed } from '@angular/core/testing';

import { RecentActivityService } from './recent-activity.service';

describe('RecentActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecentActivityService = TestBed.get(RecentActivityService);
    expect(service).toBeTruthy();
  });
});
