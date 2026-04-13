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

  constructor(private http: HttpClient, private httpService: HttpService) { }


  addEmployee(productDto: any): Observable<any> {
    console.log('got', productDto);

    return this.http.post(BASIC_URL + 'api/admin/product-registration', productDto, {
      headers: this.createAuthorizationHeader(),
    })
  }

  getAllEmployees(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/products', {
      headers: this.createAuthorizationHeader(),
    });
  }

  editData(productId: any, productDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/admin/product/${productId}`, productDto, {
      headers: this.createAuthorizationHeader(),
    })
  }


  deleteEmployee(productId: any): Observable<any> {
      return this.http.delete(BASIC_URL + `api/admin/product/${productId}`, {
        headers: this.createAuthorizationHeader(),
      })
    }



  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }
}
