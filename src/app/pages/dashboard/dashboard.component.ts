import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularMaterailModules } from '../../AngularMeterialModules';
import { AuthService } from '../../services/auth/auth.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { ProductRegistrationService } from '../../services/productRegistration/product-registration.service';
import { UserStorageService } from '../../services/storage/user-storage.service';
import { MatListModule } from '@angular/material/list';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AngularMaterailModules, DecimalPipe, MatListModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  @ViewChild('salesLineChart') salesLineCanvas!: ElementRef;
  @ViewChild('statusDoughnutChart') statusDoughnutCanvas!: ElementRef;
  @ViewChild('revenueBarChart') revenueBarCanvas!: ElementRef;

  todayOrders = 0;
  pendingOrders = 0;
  todayRevenue = 0;
  availableProducts = 0;
  lowStockCount = 0;
  completedOrders = 0;
  expiringItemsCount = 0;
  expiredItemsCount = 0;

  recentOrdersColumns: string[] = ['id', 'customer', 'amount', 'status'];

  recentOrders = new MatTableDataSource<any>([]);

  lowStockItems: any[] = [];
  dashboardData: any;

  constructor(private auth: AuthService,
    private dashboardService: DashboardService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        console.log(res);

        this.dashboardData = res;

        this.todayOrders = res.todayOrders;
        this.pendingOrders = res.pendingOrders;
        this.completedOrders = res.completedOrders;
        this.todayRevenue = res.todayRevenue;
        this.availableProducts = res.availableProducts;
        this.lowStockCount = res.lowStockCount;
        this.expiringItemsCount = res.expiringItemsCount;
        this.expiredItemsCount = res.expiredItemsCount;

        this.recentOrders.data = res.recentOrders;

        this.lowStockItems = res.lowStockItems;

        this.renderCharts();

      },
      error: (err) => {
        console.log(err);

      }
    })
  }




  renderCharts() {

    const revenueLabels = this.dashboardData.revenueChart.map((x: any) => x.label);
    const revenueValues = this.dashboardData.revenueChart.map((x: any) => x.revenue);


    // 1. Sales Overview (Line Chart)
    new Chart(this.salesLineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: revenueLabels,
        datasets: [{
          label: 'Daily Revenue',
          data: revenueValues,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 3
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    const statusLabels = this.dashboardData.orderStatus.map((x: any) => x.status);
    const statusCounts = this.dashboardData.orderStatus.map((x: any) => x.count);

    // 2. Order Status (Doughnut Chart)
    new Chart(this.statusDoughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusCounts,
          backgroundColor: ['#10b981',
            '#f59e0b',
            '#3b82f6',
            '#ef4444',
            '#8b5cf6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { position: 'bottom' } }
      }
    });


    // 3. Revenue This Month (Bar Chart)
    new Chart(this.revenueBarCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: revenueLabels,
        datasets: [{
          label: 'Revenue',
          data: revenueValues,
          backgroundColor: '#8b5cf6',
          borderRadius: 6
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // navigate(route: string) {
  //   // Replace with actual Router navigation
  //   console.log(`Navigating to ${route}...`);
  //   // this.router.navigate([`/${route}`]);
  // }

  viewAllOrders() {
    this.router.navigateByUrl("/orders");
  }

  salesReport() {
    this.router.navigateByUrl("/sales-report");
  }

  inventoryReport() {
    this.router.navigateByUrl("/inventory-report");
  }

  customerReport() {
    this.router.navigateByUrl("/customer-report");
  }

}
