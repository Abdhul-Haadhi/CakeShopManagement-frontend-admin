import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySummaryReportComponent } from './inventory-summary-report.component';

describe('InventorySummaryReportComponent', () => {
  let component: InventorySummaryReportComponent;
  let fixture: ComponentFixture<InventorySummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySummaryReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventorySummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
