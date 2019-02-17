import { TestBed } from '@angular/core/testing';

import { DisplayDataService } from './display-data.service';

describe('DisplayDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DisplayDataService = TestBed.get(DisplayDataService);
    expect(service).toBeTruthy();
  });
});
