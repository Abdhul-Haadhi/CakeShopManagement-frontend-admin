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


  items = [
    {
      routeLink: 'dashboard',
      icon: 'far fa-tachometer-alt-average',
      label: 'Dashboard',
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      routeLink: 'product-reg',
      icon: 'fal fa-utensils',
      label: 'Products',
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      routeLink: 'employee-reg',
      icon: 'fal fa-people-carry',
      label: 'Employees',
      roles: ['ADMIN'],
    },
    {
      routeLink: 'customer-reg',
      icon: 'far fa-users',
      label: 'Customers',
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      routeLink: 'category',
      icon: 'far fa-users',
      label: 'Category',
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
