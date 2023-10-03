import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_DYNAMO } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class PersonalService {
  constructor(private http: HttpClient) {}

  getListTiposHardware(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getListMarcaHardware(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  crearOactualizarHardware(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  crearPersonal(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getListTiposCuentas(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getListProyectos(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getListPerfiles(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getDescPerfil(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getDescProy(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  ListaHardwareAsignado(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  ListaCuentaAsignado(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  asignarRecurso(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  desasignarRecurso(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  cargarOBuscarcuentas(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  cargarOBuscarHardware(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  cargarOBuscarPersonal(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  cargarOBuscarHardwareDisponible(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  cargarOBuscarCuentaDisponible(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getHistoricoCambiosProyecto(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getHistoricoHarwareByPersonal(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  actualizarCuenta(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  actualizarHardware(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  actualizarPersonal(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  eliminarCuenta(id: number) {
    return this.http.post(API_DYNAMO, id);
  }

  eliminarHardware(id: number) {
    return this.http.post(API_DYNAMO, id);
  }

  eliminarPersonal(id: number) {
    return this.http.post(API_DYNAMO, id);
  }

  darBajaOaltaPersonal(id: number) {
    return this.http.post(API_DYNAMO, id);
  }

  bajaOaltaAlPersonal(id: number) {
    return this.http.post(API_DYNAMO, id);
  }

  cargarCuentasById(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  cargarPersonalById(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  cargarHardwareById(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  crearOactualizarCuenta(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  exportRecursoHard(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getListCategorias(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getListLideres(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }
}
