import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from '../storage/user-storage.service';
import { Observable } from 'rxjs';


const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  addRecipe(recipeDto: any): Observable<any> {
    return this.http.post(BASIC_URL + "api/admin/recipe", recipeDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // getAllRecipes(): Observable<any> {
  //   return this.http.get(BASIC_URL + "api/admin/recipe", {
  //     headers: this.createAuthorizationHeader(),
  //   });
  // }

  getRecipeProducts(): Observable<any> {
    return this.http.get(BASIC_URL + "api/admin/recipe/products", {
      headers: this.createAuthorizationHeader(),
    });
  }

  getRecipeByProduct(productId: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/recipe/${productId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // deleteRecipe(recipeId: number): Observable<any> {
  //   return this.http.delete(BASIC_URL + `api/admin/recipe/product/${recipeId}`, {
  //     headers: this.createAuthorizationHeader(),
  //   });
  // }

  deleteRecipe(productId: number) {
    return this.http.delete(BASIC_URL + `api/admin/recipe/product/${productId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + UserStorageService.getToken())
  }
}
