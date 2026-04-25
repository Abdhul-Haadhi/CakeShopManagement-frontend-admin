import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';


const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class ProductRegistrationService {

  constructor(private http: HttpClient, private httpService: HttpService) { }


  // serviceCall(formDetails: any){
  //   // console.log('In the service');
  //   // console.log(formDetails);
  //   // console.log("TOKEN:", this.httpService.getAuthToken());

  //   const requestUrl = environment.baseUrl + 'api/admin/product-registration';

  //   let headers = {};

  //   if(this.httpService.getAuthToken() !== null){
  //     headers = {
  //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //     };
  //   }

  //   return this.http.post(requestUrl, formDetails, {headers:headers});

  // }


  addProduct(productDto: any): Observable<any> {
    console.log('got', productDto);

    return this.http.post(BASIC_URL + 'api/employee/product-registration', productDto, {
      headers: this.createAuthorizationHeader(),
    })
  }

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/employee/products', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getProductById(productId): Observable<any> {
    return this.http.get(BASIC_URL + `api/employee/product/${productId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllProductsByName(productName: any): Observable<any> {
    return this.http.get(BASIC_URL + `api/employee/search/${productName}`, {
      headers: this.createAuthorizationHeader(),
    })
  }

  checkSkuExists(productSku: any): Observable<any> {
    return this.http.get(BASIC_URL + `api/employee/check-sku/${productSku}`,
      { headers: this.createAuthorizationHeader() }
    );
  }

  deleteProduct(productId: any): Observable<any> {
    return this.http.delete(BASIC_URL + `api/employee/product/${productId}`, {
      headers: this.createAuthorizationHeader(),
    })
  }

  editData(productId: any, productDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/employee/product/${productId}`, productDto, {
      headers: this.createAuthorizationHeader(),
    })
  }

  // editData(id: number, from_details: any) {
  //   console.log('In edit data');

  //   const requestUrl = environment.baseUrl + '/product-registration/' + id.toString();

  //   let headers = {};

  //   if (this.httpService.getAuthToken() !== null) {
  //     headers = {
  //       Authorization: 'Bearer ' + this.httpService.getAuthToken(),
  //     };
  //   }

  //   return this.http.put(requestUrl, from_details, { headers: headers })
  // }


  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }






}
