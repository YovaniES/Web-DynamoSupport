import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/');
      return false;
    } else {
      return true;
    }
  }

  // canActivate(

  //   next: ActivatedRouteSnapshot, state: RouterStateSnapshot){

  //     //const currentUser = this.authenticationService.currentUser;
  //     const currentUser = localStorage.getItem('currentUser');
  //     if(currentUser){
  //       return true;
  //     }
  //     this.router.navigate(['auth'], { queryParams: { returnUrl: state.url }});
  //     return false;
  // }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot){

  //     //const currentUser = this.authenticationService.currentUser;
  //     const currentUser = localStorage.getItem('token');
  //     if(currentUser){
  //       return true;
  //     }
  //     this.router.navigateByUrl('auth',);
  //     return false;
  // }
}
