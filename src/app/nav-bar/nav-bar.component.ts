import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from "@angular/common";
import { AuthService } from '../services/auth/auth.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import Swal from 'sweetalert2';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../components/edit-profile-dialog/edit-profile-dialog.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, NgIf, MatMenuModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {


  isLoggedIn: boolean = UserStorageService.isAdminLoggedIn() || UserStorageService.isEmployeeLoggedIn();

  constructor(public auth: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

    this.router.events.subscribe(() => {
      this.isLoggedIn = UserStorageService.isAdminLoggedIn() || UserStorageService.isEmployeeLoggedIn();
    })



  }

  openEditProfile() {
  this.dialog.open(EditProfileDialogComponent, {
    width: '450px'
  });
}

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result && !result.isConfirmed) {
        return;
      }

      UserStorageService.signOut();
      this.router.navigateByUrl('/login', { replaceUrl: true });

    });

  }

}
