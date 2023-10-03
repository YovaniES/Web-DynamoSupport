import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { API_VISOR } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class VisorService {

  constructor(private http: HttpClient) {}

  getVentaDeclarada() {
    return this.http.get<any>(API_VISOR + 'getVentaDecl').pipe(
      tap((resp: any) => {
        // console.log('VISOR_VD: ', resp);
      })
    );
  }

  getFacturados() {
    return this.http.get<any>(API_VISOR + 'getFacturados').pipe(
      tap((resp: any) => {
        // console.log('VISOR_Facturados: ', resp);
      })
    );
  }

  getLiqActivas() {
    return this.http.get<any>(API_VISOR + 'getLiqAct').pipe(
      tap((resp: any) => {
        // console.log('VISOR_LIQ_ACT: ', resp);
      })
    );
  }

  getLiqActPeriodo() {
    return this.http.get<any>(API_VISOR + 'getLiqPer').pipe(
      tap((resp: any) => {
        // console.log('VISOR_LIQ_PROY: ', resp);
      })
    );
  }

  getLiqByProyecto() {
    return this.http.get<any>(API_VISOR + 'getLiqByProyecto').pipe(
      tap((resp: any) => {
        // console.log('LIQ_BY_PROY: ', resp);
      })
    );
  }


  getLiqByProyCertificado() {
    return this.http.get<any>(API_VISOR + 'getLiqByProyCertificado').pipe(
      tap((resp: any) => {
        // console.log('LIQ_BY_PROY: ', resp);
      })
    );
  }

  getListDpf() {
    return this.http.get<any>(API_VISOR + 'getDpf').pipe(
      tap((resp: any) => {
        // console.log('DATA-DPF: ', resp);
      })
    );
  }

  getListPendienteByGestor(){
    return this.http.get<any>(API_VISOR + 'getListPendByGestor').pipe(
      tap((resp: any) => {
        // console.log('DATA-getListPendByGestor: ', resp);
      })
    );
  }
}
