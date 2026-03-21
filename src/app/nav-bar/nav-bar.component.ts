import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from "@angular/common";
import { AuthService } from '../services/auth/auth.service';
import { UserStorageService } from '../services/storage/user-storage.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {


  isLoggedIn: boolean = UserStorageService.isAdminLoggedIn();

  constructor(public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.router.events.subscribe(() => {
      this.isLoggedIn = UserStorageService.isAdminLoggedIn();
    })



  }

  logout() {
    UserStorageService.signOut();
    this.router.navigateByUrl('/login', {replaceUrl: true});
  }

}
