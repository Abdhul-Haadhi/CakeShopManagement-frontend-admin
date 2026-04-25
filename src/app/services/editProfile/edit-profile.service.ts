import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { UserStorageService } from '../storage/user-storage.service';


const BASIC_URL = "http://localhost:8080/"


@Injectable({
  providedIn: 'root'
})
export class EditProfileService {

  constructor(private http: HttpClient) { }

  editProfile(updateProfileDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/admin/profile`, updateProfileDto, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text'
    })
  }

  changeEmployeePassword(data: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/employee/change-password`, data, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text'
    });
  }

  getEmployeeById(employeeId: any) {
    return this.http.get(`${BASIC_URL}api/employee/${employeeId}`, {
      headers: this.createAuthorizationHeader()
    });
  }


  private createAuthorizationHeader(): HttpHeaders {
    const token = UserStorageService.getToken();
    console.log(token);
    return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }
}
