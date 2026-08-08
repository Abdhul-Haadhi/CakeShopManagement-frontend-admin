import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserStorageService } from '../storage/user-storage.service';
import { EmployeeReportDto } from './employee-report-dto.model';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class EmployeeRegistrationService {

  constructor(private http: HttpClient) { }

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

  getEmployeeReport(roleId?: number, activeOnly: boolean = false): Observable<EmployeeReportDto[]> {
    let params = new HttpParams().set('activeOnly', activeOnly.toString());
    if (roleId) {
      params = params.set('roleId', roleId.toString());
    }
    return this.http.get<EmployeeReportDto[]>(`${BASIC_URL}api/admin/employee-report`, {
      headers: this.createAuthorizationHeader(),
      params: params
    })
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
    console.log('service::', payload);

    return this.http.post(BASIC_URL + 'api/admin/employee-login', payload, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text'
    });
  }



  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }
}
