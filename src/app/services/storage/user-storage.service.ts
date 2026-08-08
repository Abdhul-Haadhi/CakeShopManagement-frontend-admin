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

  static getPermissions(): string[] {
    const user = this.getUser();

    if (!user || !user.permissions) {
      return [];
    }

    return user.permissions;
  }

  static hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }

  static getUser(): any {
    const user = localStorage.getItem(USER);

    if (!user) {
      return null;
    }

    return JSON.parse(user);
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

  static isUserLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  static isAdminLoggedIn(): boolean {

    if (!this.getToken()) {
      return false;
    }

    return this.getUserRole() === 'ADMIN';
  }


  static isEmployeeLoggedIn(): boolean {

    if (!this.getToken()) {
      return false;
    }

    return this.getUserRole() === 'EMPLOYEE';
  }

  static signOut(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }

}
