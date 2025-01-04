import { TestBed } from '@angular/core/testing';

import { SalaireServiceService } from './salaire-service.service';

describe('SalaireServiceService', () => {
  let service: SalaireServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaireServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
