import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/"


@Injectable({
  providedIn: 'root'
})
export class CustomizationOptionService {

  constructor(private http: HttpClient) { }


  addOption(data: any) {
    return this.http.post(BASIC_URL + 'api/employee/customization-options', data, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllOptions() {
    return this.http.get(BASIC_URL + 'api/employee/customization-options', {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateOption(id: number, data: any) {
    return this.http.put(BASIC_URL + `api/employee/customization-options/${id}`, data, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteOption(id: number) {
    return this.http.delete(BASIC_URL + `api/employee/customization-options/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }


  // ================= OPTION VALUES =================


  addValues(data: any) {
    return this.http.post(BASIC_URL + 'api/employee/customization-values', data, {
      headers: this.createAuthorizationHeader(),
    });
  }


  getValues(optionId: number) {
    return this.http.get(BASIC_URL + `api/employee/customization-values/${optionId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateValue(id: number, data: any) {
    return this.http.put(BASIC_URL + `api/employee/customization-values/${id}`, data, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteValue(id: number) {
    return this.http.delete(BASIC_URL + `api/employee/customization-values/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }


}
