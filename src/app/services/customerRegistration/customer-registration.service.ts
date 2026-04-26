import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/"


@Injectable({
  providedIn: 'root'
})
export class CustomerRegistrationService {

  constructor(private http: HttpClient) { }


  addCustomer(customerDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/employee/customer', customerDto, {
      headers: this.createAuthorizationHeader(),
    })
  }

  getAllCustomers(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/employee/customer', {
      headers: this.createAuthorizationHeader(),
    });
  }

  editData(customerId: any, customerDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/employee/customer/${customerId}`, customerDto, {
      headers: this.createAuthorizationHeader(),
    })
  }

  deleteCustomer(customerId: any): Observable<any> {
    console.log("got the delete");

    return this.http.delete(BASIC_URL + `api/employee/customer/${customerId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }


}
