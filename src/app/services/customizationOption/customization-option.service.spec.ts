import { TestBed } from '@angular/core/testing';

import { CustomizationOptionService } from './customization-option.service';

describe('CustomizationOptionService', () => {
  let service: CustomizationOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomizationOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
