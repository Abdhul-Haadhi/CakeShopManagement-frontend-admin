import { TestBed } from '@angular/core/testing';

import { EmployeeRegistrationService } from './employee-registration.service';

describe('EmployeeRegistrationService', () => {
  let service: EmployeeRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
