import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';
import { Observable } from 'rxjs';

const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http: HttpClient) { }

  addStock(stockDto: any) {
    return this.http.post(BASIC_URL + "api/employee/stock", stockDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getNextBatchNumber(inventoryId: number): Observable<string> {
    return this.http.get(BASIC_URL + `api/employee/stock/batch-number/${inventoryId}`, {
      responseType: 'text',
      headers: this.createAuthorizationHeader(),
    });
  }


  getStockHistory(id: number) {
    return this.http.get(BASIC_URL + "api/employee/stock/history/" + id, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getStockTransactions(inventoryId: number) {
    return this.http.get(BASIC_URL + "api/employee/stock/transactions/" + inventoryId, {
      headers: this.createAuthorizationHeader(),
    })
  }

  getStockTransactionReport(): Observable<any> {
    return this.http.get(BASIC_URL + "api/employee/stock/transaction-report", {
      headers: this.createAuthorizationHeader(),
    });
  }

  deductStock(stockId: number, data: any) {
    return this.http.put(BASIC_URL + "api/employee/stock/deduct/" + stockId, data, {
      headers: this.createAuthorizationHeader(),
    })
  }


  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken());
  }

}
