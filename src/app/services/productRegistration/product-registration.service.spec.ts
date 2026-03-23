import { TestBed } from '@angular/core/testing';

import { ProductRegistrationService } from './product-registration.service';

describe('ProductRegistrationService', () => {
  let service: ProductRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
