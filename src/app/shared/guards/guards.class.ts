import { Injectable } from '@angular/core';
import {
  CanLoad,
  CanActivate,
  Router,
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {Constant} from '../constants/constant.class';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canLoad(route: Route): boolean {
    if (this.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // check authentication
    return this.isLoggedIn(state.url);
  }

  isLoggedIn(url?: string): boolean {
    const currentUser = this.cookieService.get(Constant.ACCESS_TOKEN);
    if (currentUser && currentUser !== Constant.ACCESS_TOKEN) {
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: url }});
    return false;
  }
}
