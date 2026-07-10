import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  addItems(inventoryDto: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/employee/inventory', inventoryDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllItems(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/employee/inventory', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getItemSku(): Observable<string> {
    return this.http.get(BASIC_URL + 'api/employee/inventory/itemSku', {
      responseType: 'text',
      headers: this.createAuthorizationHeader(),
    });
  }

  editInventory(inventoryId: any, inventoryDto: any): Observable<any> {
    return this.http.put(BASIC_URL + `api/employee/inventory/${inventoryId}`, inventoryDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteItem(inventoryId: any): Observable<any> {
    console.log("got the delete");

    return this.http.delete(BASIC_URL + `api/employee/inventory/${inventoryId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }
}
