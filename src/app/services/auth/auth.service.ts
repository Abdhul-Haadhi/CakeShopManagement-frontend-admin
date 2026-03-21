import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserStorageService } from '../storage/user-storage.service';
import { Router } from '@angular/router';


const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private router: Router,
    private userStorageService: UserStorageService
  ) { }

  isAuthenticated(): boolean{
    if(sessionStorage.getItem('token')!==null){
      return true;
    }
    return false;
  }

  canAccess(){
    if(!this.isAuthenticated()){
      this.router.navigate(['/login'])
    }
  }

  

  register(signupRequest:any): Observable<any> {
    return this.http.post(BASIC_URL+ "sign-up", signupRequest);
  }

  login(username: String, password: String): any{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = {username, password};

    return this.http.post(BASIC_URL + 'authenticate', body, {headers, observe: 'response'}).pipe(
      map((res) =>{
        const token = res.headers.get('authorization').substring(7);
        const user = res.body;
        if(token && user){
          this.userStorageService.saveToken(token);
          this.userStorageService.saveUser(user);
          return true;
        }
        return false;
      })
    )
  }


  isLoggedin(){

  }
}
