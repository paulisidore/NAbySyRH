import { TestBed } from '@angular/core/testing';

import { ApireponseStructureService } from './apireponse-structure.service';

describe('ApireponseStructureService', () => {
  let service: ApireponseStructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApireponseStructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
