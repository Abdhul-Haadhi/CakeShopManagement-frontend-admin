import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { UserStorageService } from './services/storage/user-storage.service';
import { NgIf } from "@angular/common";
import { SideBarComponent } from './side-bar/side-bar.component';
import { MainComponent } from './main/main.component';
import { MatDividerModule } from '@angular/material/divider';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { ProductRegistrationComponent } from './pages/product-registration/product-registration.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SideBarComponent, MainComponent, RouterOutlet, RouterLink, MatToolbarModule,
    MatButtonModule, MatIconModule, MatDividerModule, FormsModule, ReactiveFormsModule, 
    HttpClientModule, NgIf, RouterLinkActive, NavBarComponent, ProductRegistrationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit{
  title = 'CakeShop-frontend-user';

  isSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  @HostListener('window:resize')
  onResize(){
    this.screenWidth.set(window.innerWidth);
    if(this.screenWidth() < 768){
      this.isSidebarCollapsed.set(true);
    }
    else{
      this.isSidebarCollapsed.set(false);
    }
  }

  // isCustomerLoggedIn : boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn : boolean = UserStorageService.isAdminLoggedIn();

  constructor(private router: Router) { }

  ngOnInit(): void {

    if(UserStorageService.isAdminLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
    else{
      this.router.navigate(['/login']);
    }


    this.isSidebarCollapsed.set(this.screenWidth() < 768);

    this.router.events.subscribe(event => {
      // this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
    })
  }

  // logout(){
  //   UserStorageService.signOut();
  //   this.router.navigateByUrl('login')
  // }


  changeIsSidebarCollapsed(isSidebarCollapsed: boolean): void{
    this.isSidebarCollapsed.set(isSidebarCollapsed);
  }

}
