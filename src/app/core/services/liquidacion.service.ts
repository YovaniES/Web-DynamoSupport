import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_CERTIFICACION, BASE_HIST_LIQ, BASE_LIQUIDACION, BASE_VENTADECLARADA, PATH_IMPORT_LIQ } from '../constants/url.constants';
import { RequestLiquidacion } from '../models/liquidacion.models';
import { SaveLiquidacionModel } from '../models/save-liquidacion.models';
import { Observable, map } from 'rxjs';

@Injectable({providedIn: 'root',})
export class LiquidacionService {

  constructor(private http: HttpClient,) {}

  insertarListadoLiquidacion(listImport: SaveLiquidacionModel[]): Observable<any> {
    return this.http.post(PATH_IMPORT_LIQ + '/guardar', listImport);
  }

  getAllLiquidaciones(listLiq: any){
    return this.http.post(BASE_LIQUIDACION + '/GetAllLiquidacion', listLiq);
  }

  getLiquidacionById(idLiq: number): Observable<any>{ //liqById
    return this.http.get(`${BASE_LIQUIDACION}/GetLiquidacionById/${idLiq}`).pipe(
      map((resp: any) => {
        console.log('DATA_BY_ID', resp.result);

        return resp.result;
      })
    );
  }

  createLiquidacion(requestLiq: RequestLiquidacion[]): Observable<any>{
    return this.http.post(BASE_LIQUIDACION, requestLiq);
  }

  actualizarLiquidacion(idFact: number, requestLiq: RequestLiquidacion){
    return this.http.put<any>(`${BASE_LIQUIDACION}/${idFact}`, requestLiq)
  }

  // VENTA DECLARADA Y CERTIFICACIONES
  getAllVentaDeclarada(idLiq: any): Observable<any>{ //any <> IResponse: {message: , result: , }
    return this.http.post(`${BASE_VENTADECLARADA}/idFactura`, idLiq)
    // .pipe(
    //   map((resp: any) => {
    //     console.log('VD_SERV', resp);

    //   })
    // );
  }

  getVentaDeclaradaById(idVentaDecl: number){
    return this.http.get(`${BASE_VENTADECLARADA}/${idVentaDecl}`)
    .pipe(
      map((resp: any) => {
        console.log('DATA_BY_ID', resp.result);

        // for (let i = 0; i < resp.result.length; i++) {
        //   console.log('ID_SERV_VD', resp, resp.result.length);

      // }
          return resp.result;
      })
    );
  }

  getCertificacionById(idcert: number){
    return this.http.get(`${BASE_CERTIFICACION}/${idcert}`)
    .pipe(
      map((resp: any) => {
        console.log('DATA_BY_CERT', resp.result);

          return resp.result;
      })
    );
  }

  getListCertificacion(idCert: any){
    return this.http.post(`${BASE_CERTIFICACION}/idFactura`, idCert)
    // .pipe(
    //   map((resp: any) => {
    //     console.log('CERT_SERV', resp);
    //   })
    // );
  }

  // BASE_HIST_LIQ
  getHistLiquidacion(idLiq: number){
    return this.http.get(`${BASE_HIST_LIQ}/${idLiq}`)
  }
}
