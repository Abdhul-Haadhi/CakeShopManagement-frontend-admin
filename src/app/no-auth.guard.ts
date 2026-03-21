import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from './services/storage/user-storage.service';

export const noAuthGuard: CanActivateFn = (route, state) => {


  const router = inject(Router);

  if(UserStorageService.isAdminLoggedIn()){
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
