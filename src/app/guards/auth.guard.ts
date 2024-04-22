import { HttpClient } from '@angular/common/http';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  // constructor(private authService: AuthService, private router: Router) {}implements CanActivate

  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   if (this.authService.isLoggedIn()) {
  //     return true;
  //   } else {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }
  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    // Logic to check if the user is authenticated
    // For example, you might check if there is a token stored in localStorage or if the user object exists in memory
    // Return true if authenticated, false otherwise
    return !!localStorage.getItem('token'); // Example: Check if a token exists in localStorage
  }
}
