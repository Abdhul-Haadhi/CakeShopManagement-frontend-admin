import { Component, input, OnInit, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgClass, NgIf } from "@angular/common";
import { AuthService } from '../services/auth/auth.service';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule, NgClass, NgIf],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {

  // isLoggedIn: boolean = UserStorageService.isAdminLoggedIn() || UserStorageService.isEmployeeLoggedIn();

  // currentRole: string = '';

  isLoggedIn: boolean = UserStorageService.isUserLoggedIn();
  currentRole: string = '';





  constructor(public auth: AuthService,
    private router: Router,
    public userStorageService: UserStorageService,
  ) { }

  ngOnInit(): void {

    this.currentRole = UserStorageService.getUserRole();
    console.log('Current Role:', this.currentRole);

    this.auth.canAccess();

    this.router.events.subscribe(() => {
      // this.isLoggedIn = UserStorageService.isAdminLoggedIn() || UserStorageService.isEmployeeLoggedIn();
      this.isLoggedIn = UserStorageService.isUserLoggedIn();
      this.currentRole = UserStorageService.getUserRole();
    });




  }

  isSidebarCollapsed = input.required<boolean>();
  changeIsSidebarCollapsed = output<boolean>();

  isAdmin(): boolean {
    return UserStorageService.getUserRole() === 'ADMIN';
  }

  isEmployee(): boolean {
    return UserStorageService.getUserRole() === 'EMPLOYEE';
  }

  hasPermission(permission: string): boolean {
    return UserStorageService.hasPermission(permission);
  }




  items: any[] = [
    {
      isHeading: true,
      label: 'Daily Operations',
      permission: 'DASHBOARD_MANAGEMENT'
    },
    {
      routeLink: 'dashboard',
      icon: 'far fa-home',
      label: 'Home',
      permission: 'DASHBOARD_MANAGEMENT',
    },
    {
      routeLink: 'orders',
      icon: 'fas fa-receipt',
      label: 'Orders',
      permission: 'ORDER_MANAGEMENT',
    },
    

    {
      isHeading: true,
      label: 'Catalog & Inventory',
      permission: 'CATEGORY_MANAGEMENT'
    },
    {
      routeLink: 'category',
      icon: 'fas fa-layer-group',
      label: 'Category',
      permission: 'CATEGORY_MANAGEMENT',
    },
    {
      routeLink: 'product-reg',
      icon: 'fas fa-birthday-cake',
      label: 'Products',
      permission: 'PRODUCT_MANAGEMENT'
    },
    {
      routeLink: 'inventory',
      icon: 'fas fa-boxes',
      label: 'Inventory Items',
      permission: 'INVENTORY_MANAGEMENT'
    },
    {
      routeLink: 'recipe',
      icon: 'fas fa-book-open',
      label: 'Manage Recipe',
      permission: 'RECIPE_MANAGEMENT'
    },

    {
      isHeading: true,
      label: 'People & HR',
      permission: 'EMPLOYEE_MANAGEMENT'
    },
    {
      routeLink: 'employee-reg',
      icon: 'fas fa-user-tie',
      label: 'Employees',
      permission: 'EMPLOYEE_MANAGEMENT'
    },
    {
      routeLink: 'customer-reg',
      icon: 'fas fa-users',
      label: 'Customers',
      permission: 'CUSTOMER_MANAGEMENT'
    },
    {
      routeLink: 'permission',
      icon: 'fas fa-key', // Replaced duplicated receipt
      label: 'Permission',
      permission: 'PERMISSION_MANAGEMENT'
    },
    {
      routeLink: 'role',
      icon: 'fas fa-id-badge', // Replaced duplicated receipt
      label: 'Roles',
      permission: 'ROLE_MANAGEMENT'
    },

    {
      isHeading: true,
      label: 'Reports',
      permission: 'REPORT_MANAGEMENT'
    },
    {
      routeLink: 'inventory-summary-report',
      icon: 'fas fa-clipboard-check',
      label: 'Inventory Summary Report',
      permission: 'REPORT_MANAGEMENT'
    },
    {
      routeLink: 'inventory-report',
      icon: 'fas fa-file-alt', // Replaced duplicated clipboard
      label: 'Inventory Batch Report',
      permission: 'REPORT_MANAGEMENT'
    },
    {
      routeLink: 'stock-transaction-report',
      icon: 'fas fa-exchange-alt', // Replaced duplicated clipboard
      label: 'Stock Transactions',
      permission: 'REPORT_MANAGEMENT'
    },
    {
      routeLink: 'sales-report',
      icon: 'fas fa-chart-line',
      label: 'Sales Report',
      permission: 'REPORT_MANAGEMENT'
    },
    {
      routeLink: 'product-report',
      icon: 'fas fa-chart-line',
      label: 'Products Report',
      permission: 'REPORT_MANAGEMENT'
    },
    {
      routeLink: 'customer-report',
      icon: 'fas fa-user-tag',
      label: 'Customer Report',
      permission: 'REPORT_MANAGEMENT'
    },
    {
      routeLink: 'employee-report',
      icon: 'fas fa-user-tag',
      label: 'Employee Report',
      permission: 'REPORT_MANAGEMENT'
    },
  ]

  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
  }


  closeSideNav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }
}
