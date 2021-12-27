import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
    if (this.isTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }

  private isTokenExpired(): boolean {
    let token: string = this.authService.token;
    let payload: any = this.authService.getDataFromToken(token);
    let now = new Date().getTime() / 1000;
    return payload.exp < now;
  }

}
