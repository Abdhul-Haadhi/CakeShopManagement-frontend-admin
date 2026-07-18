import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AngularMaterailModules } from "../../AngularMeterialModules";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsDialogComponent } from '../../components/order-details-dialog/order-details-dialog.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe, NgFor, NgIf, AngularMaterailModules, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  orders: any[] = [];
  // expandedOrderId: number | null = null;

  // displayedColumns: string[] = [
  //   'orderId',
  //   'totalAmount',
  //   'quantity',
  //   // 'trackingId',
  //   'status',
  //   'orderDate',
  //   'deliveryDate',
  //   'actions'
  // ];

  displayedColumns: string[] = [
    'orderId',
    'customer',
    'totalAmount',
    'quantity',
    'status',
    'deliveryDate',
    'actions'
  ];


  statuses = [
    'PENDING',
    'CONFIRMED',
    'BAKING',
    'OUT FOR DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ];

  constructor(private orderService: OrderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getAllOrders().subscribe((res: any) => {

      console.log("orders:", res);

      // this.orders = res;

      if (res.variants && res.variants.length > 0) {
        res.selectedVariant = res.variants[0];
      }

      this.orders = res.map(order => ({
        ...order,
        originalStatus: order.status
      }))

    })
  }

  changeStatus(orderId: number, status: string) {
    this.orderService.updateStatus(orderId, status).subscribe({
      next: (response: any) => {
        this.getOrders();
        this.snackBar.open('Status updated successfully', 'Ok', { duration: 3000 });
      },
      error: (error) => {
        console.log(error);
        console.log(error.error);
        console.log(error.error?.message);

        let message = error.error?.message || 'Update failed';

        this.snackBar.open(message, 'OK', {
          duration: 4000
        });
      }


    })
  }

  getAllowedStatuses(currentStatus: string): string[] {
    switch (currentStatus) {
      case 'PENDING':
        return ['PENDING', 'CONFIRMED', 'CANCELLED'];

      case 'CONFIRMED':
        return ['CONFIRMED', 'BAKING'];

      case 'BAKING':
        return ['BAKING', 'OUT FOR DELIVERY', 'DELIVERED',];

      case 'OUT FOR DELIVERY':
        return ['OUT FOR DELIVERY', 'DELIVERED'];

      case 'DELIVERED':
        return ['DELIVERED'];

      case 'CANCELLED':
        return ['CANCELLED'];

      default:
        return [currentStatus];
    }
  }

  // toggleItems(orderId: number) {
  //   if (this.expandedOrderId === orderId) {
  //     this.expandedOrderId = null;
  //   }
  //   else {
  //     this.expandedOrderId = orderId;
  //   }
  //   const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
  //     width: '500px',
  //     data: {
  //       orders: this.getOrders()
  //     }
  //   });
  // }

  viewDetails(order: any) {
    const dialogRef = this.dialog.open(OrderDetailsDialogComponent, {
      width: '800px', // Adjusted width so it looks good
      data: {
        order: order // Pass the single order object that was clicked
      }
    });
  }
}
