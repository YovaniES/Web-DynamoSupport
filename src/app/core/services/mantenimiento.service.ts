import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_MANTENIMIENTO } from '../constants/url.constants';

@Injectable({ providedIn: 'root' })
export class MantenimientoService {

  constructor(private http: HttpClient) {}

  getAllGestores() {
    return this.http.get(BASE_MANTENIMIENTO + '/Gestor');
  }

  getAllProyectos(){
    return this.http.get(BASE_MANTENIMIENTO + '/Proyecto');
  }

  getAllEstados(){
    return this.http.get(BASE_MANTENIMIENTO + '/EstadoLiquidacion');
  }
  // getLiquidacionById(idLiq: number) {
  //   return this.http.get(`${BASE_MANTENIMIENTO}'/GetLiquidacionById/'${idLiq}`);
  // }
}
