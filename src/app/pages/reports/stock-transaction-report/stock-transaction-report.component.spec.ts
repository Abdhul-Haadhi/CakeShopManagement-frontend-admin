import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransactionReportComponent } from './stock-transaction-report.component';

describe('StockTransactionReportComponent', () => {
  let component: StockTransactionReportComponent;
  let fixture: ComponentFixture<StockTransactionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTransactionReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockTransactionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
