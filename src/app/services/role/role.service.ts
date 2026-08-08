import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  addRole(role: any) {
    return this.http.post(BASIC_URL + "api/admin/roles", role,
      {
        headers: this.createAuthorizationHeader()
      }
    );
  }

  getAllRoles() {
    return this.http.get(BASIC_URL + "api/admin/roles", {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateRole(id: number, role: any) {
    return this.http.put(BASIC_URL + "api/admin/roles/" + id, role,
      {
        headers: this.createAuthorizationHeader()
      }
    );
  }

  deleteRole(id: number) {
    return this.http.delete(BASIC_URL + "api/admin/roles/" + id,
      {
        headers: this.createAuthorizationHeader()
      }
    );
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }
}
