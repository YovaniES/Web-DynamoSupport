import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_DYNAMO } from '../constants/url.constants';

@Injectable({providedIn: 'root',})
export class EntidadService {
  constructor(private http: HttpClient) {}

  eliminarEntidad(id: number) {
    return this.http.post(API_DYNAMO, id);
  }

  crearEntidadLista(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  actualizarTablaEntidad(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  agregarEntidadTabla(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  getListEntidades(obj: any) {
    return this.http.post(API_DYNAMO, obj);
  }

  cargarOBuscarEntidades(id: any) {
    return this.http.post(API_DYNAMO, id);
  }

  getListEntidadesLider(id: any) {
    return this.http.post(API_DYNAMO, id);
  }
}

