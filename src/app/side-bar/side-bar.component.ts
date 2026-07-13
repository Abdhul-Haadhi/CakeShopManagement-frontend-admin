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

  isLoggedIn: boolean = UserStorageService.isAdminLoggedIn() || UserStorageService.isEmployeeLoggedIn();

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
      this.isLoggedIn = UserStorageService.isAdminLoggedIn() || UserStorageService.isEmployeeLoggedIn();

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


  items: any[] = [
    {
      isHeading: true,
      label: 'Daily Operations',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      routeLink: 'dashboard',
      // icon: 'far fa-tachometer-alt-average',
      icon: 'far fa-home',
      label: 'Home',
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      routeLink: 'orders',
      icon: 'fas fa-receipt',
      label: 'Orders',
      roles: ['ADMIN', 'EMPLOYEE'],
    },


    {
      isHeading: true,
      label: 'Catalog & Inventory',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      routeLink: 'category',
      icon: 'fas fa-layer-group',
      label: 'Category',
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      routeLink: 'product-reg',
      icon: 'fas fa-birthday-cake',
      label: 'Products',
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      routeLink: 'inventory',
      icon: 'fas fa-boxes',
      label: 'Inventory Items',
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      routeLink: 'recipe',
      icon: 'fas fa-book-open',
      label: 'Manage Recipe',
      roles: ['ADMIN'],
    },


    {
      isHeading: true,
      label: 'People & HR',
      roles: ['ADMIN', 'EMPLOYEE']
    },
    {
      routeLink: 'employee-reg',
      icon: 'fas fa-user-tie',
      label: 'Employees',
      roles: ['ADMIN'],
    },
    {
      routeLink: 'customer-reg',
      icon: 'fas fa-users',
      label: 'Customers',
      roles: ['ADMIN', 'EMPLOYEE'],
    },




  ]

  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
  }


  closeSideNav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }
}
