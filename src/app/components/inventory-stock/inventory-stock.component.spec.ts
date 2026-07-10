import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStockComponent } from './inventory-stock.component';

describe('InventoryStockComponent', () => {
  let component: InventoryStockComponent;
  let fixture: ComponentFixture<InventoryStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryStockComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
