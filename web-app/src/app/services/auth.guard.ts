import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.router.navigate(['/app/bookingApp']);
    return false;
  }

}
