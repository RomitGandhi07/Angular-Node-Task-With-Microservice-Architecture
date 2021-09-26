import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate  {
  constructor(private router:Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (sessionStorage.getItem("isAdmin") && sessionStorage.getItem("isLogin")) {
        this.router.navigate(['/users']);
        return false;
      }
      if (sessionStorage.getItem("isUser") && sessionStorage.getItem("isLogin")) {
        this.router.navigate(['/user-home']);
        return false;
      }
      return true;
  }
  
}
