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
    return this.http.post(BASIC_URL + 'api/admin/product-registration', productDto, {
      headers: this.createAuthorizationHeader(),
    })
  }

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/products', {
      headers: this.createAuthorizationHeader(),
    })
  }


  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }






}
