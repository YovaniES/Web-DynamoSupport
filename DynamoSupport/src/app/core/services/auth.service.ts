import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { AUTH_SESSION } from '../constants/url.constants';
import { of } from 'rxjs';
import { ROLES_ENUM, ROL_ADMIN, ROL_COORD_LIDER, ROL_COOR_TDP, ROL_GESTOR, ROL_LIDER, ROL_SUPER_ADMIN } from '../constants/rol.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  toggleUserPanel = new EventEmitter<boolean>();
  currentUser: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(loginData: any) {
    return this.http.post<any>(AUTH_SESSION, loginData).pipe(
      tap((resp: any) => {
        console.log('LOGIN_ACCESO: ', resp.user.acceso);
        console.log('LOGIN_APLIC: ', resp.user.aplicacion);
        console.log('LOGIN_ROLNAME: ', resp.user.rolName);
        // console.log('TOKEN: ', resp.user.token);

        localStorage.setItem('token', resp.user.token);
        localStorage.setItem('currentUser', JSON.stringify(resp));
      })
    );
  }

  getUserNameByRol(filtroResponsable: number){
    const usuarioLogueado: any = this.decodeToken();
    console.log('id_respon', usuarioLogueado);

    if (this.esUsuarioSuperAdmin() || this.esUsuarioCoordTdp()) {
      return filtroResponsable? filtroResponsable: null
    }

    if (this.esUsuarioLider()) {
      return filtroResponsable? filtroResponsable: usuarioLogueado.USER_ID;
    }

    if (this.esCoordLider()) {
      return filtroResponsable? filtroResponsable: usuarioLogueado.USER_ID;
      }
      return usuarioLogueado.USER_ID;  //USER_ID: 441 (name:jysantiago)
    }

  //Obtenemos el ROL_ID, desde el TOKEN: ROL_ID=101,102,103,..106 (ROL_ID=106 : SUPER_ADMIN)
  getRolID(){
    const decodedToken: any = this.decodeToken();
    // console.log('TOKEN-ROL_ID', decodedToken);
    return decodedToken ? decodedToken.ROL_ID : '';
  }

  // Obtenemos desde el TOKEN: unique_name:"jysantiago"; También el ID_ROL=101,102,...106
  getUsername() {
      const decodedToken: any = this.decodeToken();
      // console.log('DECODE_TOKEN - UNIQUE_NAME', decodedToken, decodedToken.name);
      return decodedToken ? decodedToken.name : '';
  }

  hasAccessToModule(roles: ROLES_ENUM[]){
    const decodedToken_RolId: any = this.decodeToken()
    return roles.includes(decodedToken_RolId.ROL_ID)
  }

  esUsuarioSuperAdmin(){
    const usuarioLogueado: any = this.decodeToken();
    return usuarioLogueado && usuarioLogueado.ROL_ID == ROL_SUPER_ADMIN.rolID
  }

  esUsuarioLider(){
    const usuarioLogueado: any = this.decodeToken();
    return usuarioLogueado && usuarioLogueado.ROL_ID == ROL_LIDER.rolID
  }

  esCoordLider(){
    const usuarioLogueado: any = this.decodeToken();
    return usuarioLogueado && usuarioLogueado.ROL_ID == ROL_COORD_LIDER.rolID
  }

  esUsuarioCoordTdp(){
    const usuarioLogueado: any = this.decodeToken();
    return usuarioLogueado && usuarioLogueado.ROL_ID == ROL_COOR_TDP.rolID
  }

  esUsuarioAdmin(){
    const usuarioLogueado: any = this.decodeToken();
    return usuarioLogueado && usuarioLogueado.ROL_ID == ROL_ADMIN.rolID
  }

  esUsuarioGestor(){
    const usuarioLogueado: any = this.decodeToken();
    return usuarioLogueado && usuarioLogueado.ROL_ID == ROL_GESTOR.rolID
  }

  getCurrentUser() {
    const currentUser: any = localStorage.getItem('currentUser');
    // console.log('CURRENT_USER',JSON.parse(currentUser));
    return of(currentUser ? JSON.parse(currentUser) : '');
  }


  decodeToken() {
    const token = localStorage.getItem('token');
    if (token) {
      return jwt_decode(token);
    } else {
      return null;
    }
  }

  // IApiUserAuthenticated
  get getUser(): any {
    // console.log('USS', this.currentUser);

    return this.currentUser;
  }


  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    let validSession = false;
    let decodedToken: any = null;

    try {
      if (token) {
        decodedToken = jwt_decode(token);
      }

      if (decodedToken && decodedToken.exp) {
        validSession = true;
      }
      return validSession;
    } catch (err) {
      return false;
    }
  }

  logout() {
    this.router.navigateByUrl('auth');
    localStorage.clear();
  }
}
