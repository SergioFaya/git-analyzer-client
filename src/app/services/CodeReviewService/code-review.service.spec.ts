import { TestBed } from '@angular/core/testing';

import { CodeReviewService } from './code-review.service';

describe('CodeReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CodeReviewService = TestBed.get(CodeReviewService);
    expect(service).toBeTruthy();
  });
});
