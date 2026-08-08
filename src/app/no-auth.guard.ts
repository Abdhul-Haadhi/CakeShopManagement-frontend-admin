import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStorageService } from './services/storage/user-storage.service';

export const noAuthGuard: CanActivateFn = (route, state) => {


  const router = inject(Router);

  if (UserStorageService.isUserLoggedIn() && UserStorageService.hasPermission("DASHBOARD_MANAGEMENT")) {
    router.navigate(['/dashboard']);
    return false;
  }
  else if(UserStorageService.isUserLoggedIn()){
    router.navigate(['/about']);
    return false;
  }
  return true;
};
