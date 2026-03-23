import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductRegistrationService {

  constructor(private http: HttpClient, private httpService: HttpService) { }


  serviceCall(formDetails: any){
    console.log('In the service');

    const requestUrl = environment.baseUrl + '/product-registration';

    let headers = {};

    if(this.httpService.getAuthToken() !== null){
      headers = {
        Authorization: 'Bearer ' + this.httpService.getAuthToken(),
      };
    }
    
  }


}
