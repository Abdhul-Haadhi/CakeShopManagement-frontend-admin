import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewShopOrderComponent } from './new-shop-order.component';

describe('NewShopOrderComponent', () => {
  let component: NewShopOrderComponent;
  let fixture: ComponentFixture<NewShopOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewShopOrderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewShopOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
