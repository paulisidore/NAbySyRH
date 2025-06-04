import { TestBed } from '@angular/core/testing';

import { CommonKssvServiceService } from './common-kssv-service.service';

describe('CommonKssvServiceService', () => {
  let service: CommonKssvServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonKssvServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
