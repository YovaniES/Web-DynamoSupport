import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate {

  constructor( private authService: AuthService,
               private router: Router){}

  canActivate(): Observable<boolean> | boolean  {

    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/auth')
      return false;
    }
    return true;
  }

  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{

  //     // const currentUser1 = localStorage.getItem('currentUser');

  //     const currentUser = this.authService.getUsername();
  //     console.log('USER_GUARD', currentUser);
  //     if(currentUser){
  //       if (next.data['rol_menu'] && !this.authService.hasAccessToModule(next.data['rol_menu'])) {
  //         this.router.navigateByUrl('error/404')
  //         return false
  //       }
  //       return true;
  //     }
  //     this.router.navigate(['auth'], { queryParams: { returnUrl: state.url }});
  //     return false;
  // }


}
