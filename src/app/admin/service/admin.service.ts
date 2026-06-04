import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';


const BASIC_URL = "http://localhost:8080/"

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  addCategory(categoryDto:any): Observable<any>{
    return this.http.post(BASIC_URL + 'api/employee/category', categoryDto, {
      headers: this.createAuthorizationHeader(),
    })
  }

  getAllCategories(): Observable<any>{
    return this.http.get(BASIC_URL + 'api/employee/categories', {
      headers: this.createAuthorizationHeader(),
    })
  }

  editCategory(categoryId: any, categoryDto: any): Observable<any> {
      return this.http.put(BASIC_URL + `api/employee/categories/${categoryId}`, categoryDto, {
        headers: this.createAuthorizationHeader(),
      })
    }

  deleteCategory(categoryId:any): Observable<any>{
    return this.http.delete(BASIC_URL + `api/employee/category/${categoryId}`, {
      headers: this.createAuthorizationHeader(),
    })
  }



  private createAuthorizationHeader(): HttpHeaders{
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }
}
