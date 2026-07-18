import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from "@angular/common";
import { AuthService } from '../services/auth/auth.service';
import { UserStorageService } from '../services/storage/user-storage.service';
import Swal from 'sweetalert2';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponent } from '../components/edit-profile-dialog/edit-profile-dialog.component';
import { MatBadgeModule } from '@angular/material/badge';
import { WebsocketService } from '../services/notification/websocket.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, MatBadgeModule, NgFor, NgIf, MatMenuModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit, OnDestroy {


  isLoggedIn: boolean = UserStorageService.isAdminLoggedIn() || UserStorageService.isEmployeeLoggedIn();

  notifications: any[] = [];
  unreadCount: number = 0;
  private notificationSub!: Subscription;

  constructor(public auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private webSocketService: WebsocketService
  ) { }

  ngOnInit(): void {

    this.handleWebSocketConnection(this.isLoggedIn);

    this.router.events.subscribe(() => {
      const currentlyLoggedIn = UserStorageService.isAdminLoggedIn() || UserStorageService.isEmployeeLoggedIn();

      if (currentlyLoggedIn !== this.isLoggedIn) {
        this.isLoggedIn = currentlyLoggedIn;
        this.handleWebSocketConnection(currentlyLoggedIn);
      }
    });
  }


  private handleWebSocketConnection(loggedIn: boolean) {
    if (loggedIn && UserStorageService.isAdminLoggedIn()) {

      // 1. Fetch missed historical notifications from the database
      this.webSocketService.getUnreadNotifications().subscribe((missedNotifs: any[]) => {
        this.notifications = missedNotifs;
        this.unreadCount = missedNotifs.length;

        // If there are missed notifications, play the sound on login!
        if (this.unreadCount > 0) {
          this.webSocketService.playAudioAlert();
        }
      });

      // 2. Connect to WebSocket for live notifications
      this.webSocketService.connectAdmin();

      this.notificationSub = this.webSocketService.notifications$.subscribe(notification => {
        this.notifications.unshift(notification);
        this.unreadCount++;
      });
    }
    else {
      this.webSocketService.disconnect();
      if (this.notificationSub) {
        this.notificationSub.unsubscribe();
      }
    }
  }

  onBellClick() {
    if (this.unreadCount > 0) {
      this.unreadCount = 0;

      this.webSocketService.markNotificationsAsRead().subscribe({
        next: () => console.log("Notifications marked as read in DB"),
        error: (err) => console.error("Failed to mark notifications read", err)
      });
    }

  }

  openEditProfile() {
    const employeeId = UserStorageService.getEmployeeId();

    console.log("Employee ID:", employeeId);

    this.dialog.open(EditProfileDialogComponent, {
      width: '450px',
      data: { employeeId }
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
      this.webSocketService.disconnect();
      this.notifications = [];
      this.unreadCount = 0;
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });

  }

  ngOnDestroy(): void {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

}
