import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserStorageService } from './services/storage/user-storage.service';

export const authGuard: CanActivateFn = (route, state) => {


  const router = inject(Router);

  if(UserStorageService.getToken()){
    return true;
  }
  else{
    router.navigate(['/login']);
    return false;
  }

};
