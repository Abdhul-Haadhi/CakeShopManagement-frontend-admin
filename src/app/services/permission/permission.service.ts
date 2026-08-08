import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

  addPermission(permission: any) {
    return this.http.post(
      BASIC_URL + "api/admin/permissions", permission, {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllPermissions() {
    return this.http.get<any[]>(BASIC_URL + "api/admin/permissions", {
      headers: this.createAuthorizationHeader()
    });
  }

  updatePermission(id: number, permission: any) {
    return this.http.put(
      BASIC_URL + "api/admin/permissions/" + id,
      permission,
      {
        headers: this.createAuthorizationHeader()
      }
    );
  }

  deletePermission(id: number) {
    return this.http.delete(
      BASIC_URL + "api/admin/permissions/" + id,
      {
        headers: this.createAuthorizationHeader()
      }
    );
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      'Bearer ' + UserStorageService.getToken()
    );
  }
}