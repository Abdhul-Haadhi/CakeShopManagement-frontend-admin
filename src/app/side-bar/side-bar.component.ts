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
export class SideBarComponent implements OnInit{

  isLoggedIn: boolean = UserStorageService.isAdminLoggedIn();


  constructor(public auth: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.auth.canAccess();

    this.router.events.subscribe(() => {
      this.isLoggedIn = UserStorageService.isAdminLoggedIn();
    })
  }

  isSidebarCollapsed = input.required<boolean>();
  changeIsSidebarCollapsed = output<boolean>();


  items = [
    {
      routeLink: 'dashboard',
      icon: 'far fa-tachometer-alt-average',
      label: 'Dashboard',
    },
    {
      routeLink: 'product-reg',
      icon: 'fal fa-utensils',
      label: 'Products',
    },
    {
      routeLink: 'employee-reg',
      icon: 'fal fa-people-carry',
      label: 'Employees',
    },
    {
      routeLink: 'customer-reg',
      icon: 'far fa-users',
      label: 'Customers',
    },
    {
      routeLink: 'category',
      icon: 'far fa-users',
      label: 'Category',
    },
  ]

  toggleCollapse(): void{
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed());
  }


  closeSideNav(): void{
    this.changeIsSidebarCollapsed.emit(true);
  }
}
