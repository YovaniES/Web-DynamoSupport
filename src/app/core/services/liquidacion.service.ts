import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_LIQUIDACION, PATH_IMPORT_LIQ } from '../constants/url.constants';
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

}
