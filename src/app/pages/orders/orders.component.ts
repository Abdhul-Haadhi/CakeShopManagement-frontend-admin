import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AngularMaterailModules } from "../../AngularMeterialModules";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, AngularMaterailModules],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  expandedOrderId: number | null = null;

  statuses = [
    'PENDING',
    'CONFIRMED',
    'BAKING',
    'OUT FOR DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ];

  constructor(private orderService: OrderService) { }


  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getAllOrders().subscribe((res: any) => {

      console.log("orders:", res);

      this.orders = res;
    })
  }

  changeStatus(orderId: number, status: string) {
    this.orderService.updateStatus(orderId, status).subscribe(() => {
      this.getOrders();
    })
  }

  toggleItems(orderId: number) {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    }
    else {
      this.expandedOrderId = orderId;
    }
  }
}
