import { Injectable } from '@angular/core';

const TOKEN = 'cakeShop-token'
const USER = 'cakeShop-user'

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }


  public saveUser(user): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }

  static getUser(): any {
    return JSON.parse(localStorage.getItem(USER));
  }

  static getUserId(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.userId;
  }

  static getEmployeeId(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.employeeId;
  }

  static getUserRole(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.role;
  }

  static isAdminLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }

    const role: string = this.getUserRole();
    return role == 'ADMIN';
  }


  static isEmployeeLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }

    const role: string = this.getUserRole();
    return role == 'EMPLOYEE';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }

}
