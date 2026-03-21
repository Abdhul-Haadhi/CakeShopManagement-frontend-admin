import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { NgIf } from "@angular/common";
import { UserStorageService } from '../../services/storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  isLoggedIn: boolean = UserStorageService.isAdminLoggedIn();

  constructor(private auth: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {

    this.router.events.subscribe(() => {
      this.isLoggedIn = UserStorageService.isAdminLoggedIn();
    })
    // this.auth.canAccess();
  }
}
