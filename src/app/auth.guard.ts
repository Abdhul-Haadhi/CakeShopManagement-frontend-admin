import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserStorageService } from './services/storage/user-storage.service';

export const authGuard: CanActivateFn = (route, state) => {


  const router = inject(Router);
  const token = UserStorageService.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      alert("Session expired. Please login again");
      UserStorageService.signOut();
      router.navigate(['/login']);
      return false;
    }

    return true;
  } catch {
    UserStorageService.signOut();
    router.navigate(['/login']);
    return false;
  }

  // if(UserStorageService.getToken()){
  //   return true;
  // }
  // else{
  //   router.navigate(['/login']);
  //   return false;
  // }

};
