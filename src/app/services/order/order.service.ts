import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }


  getAllOrders() {
    return this.http.get(BASIC_URL + 'api/employee/get-orders', {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateStatus(orderId: number, status: string) {
    return this.http.put(BASIC_URL + `api/employee/update-order/${orderId}/${status}`, {}, {
      headers: this.createAuthorizationHeader(),
    })
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }
}
