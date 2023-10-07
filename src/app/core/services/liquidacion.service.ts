import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { PATH_IMPORT_LIQ } from '../constants/url.constants';
import { LiquidacionModel } from '../models/liquidacion.models';

@Injectable({providedIn: 'root',})
export class LiquidacionService {
  toggleUserPanel = new EventEmitter<boolean>();
  currentUser: any;

  constructor(private http: HttpClient,) {}

  insertarListadoLiquidacion(listImport: LiquidacionModel[]) {
    return this.http.post(PATH_IMPORT_LIQ + '/guardar', listImport);
  }
}
