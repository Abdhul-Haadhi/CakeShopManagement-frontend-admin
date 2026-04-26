import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class EmployeeRegistrationService {

  constructor(private http: HttpClient) { }


  // addEmployee(employeeDto: any): Observable<any> {
  //   console.log('got:::', employeeDto);

  //   return this.http.post(BASIC_URL + 'api/admin/employee', employeeDto, {
  //     headers: this.createAuthorizationHeader(),
  //   })
  // }

  addEmployee(employeeDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/employee', employeeDto, {
      headers: this.createAuthorizationHeader(),
    })
  }

  getAllEmployees(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/employee', {
      headers: this.createAuthorizationHeader(),
    });
  }

  editData(employeeId: any, employeeDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/admin/employee/${employeeId}`, employeeDto, {
      headers: this.createAuthorizationHeader(),
    })
  }


  deleteEmployee(employeeId: any): Observable<any> {
    console.log("got the delete");

    return this.http.delete(BASIC_URL + `api/admin/employee/${employeeId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  createEmployeeLogin(payload: any): Observable<any> {
    console.log('service::',payload);
    
    return this.http.post(BASIC_URL + 'api/admin/employee-login', payload, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text'
    });
  }



  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }
}
