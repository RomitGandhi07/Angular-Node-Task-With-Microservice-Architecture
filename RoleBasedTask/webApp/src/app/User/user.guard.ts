import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate  {
  constructor(private router:Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (!(sessionStorage.getItem("isUser") && sessionStorage.getItem("isLogin"))) {
        alert("Please Login First")
        this.router.navigate(['/login']);
        return false;
      }
      return true;
  }
  
}
