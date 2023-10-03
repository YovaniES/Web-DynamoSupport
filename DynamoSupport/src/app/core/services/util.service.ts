import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private datePipe: DatePipe) {}

  generarPeriodo(fechaPeriodo: string) {
    // console.log('fecha_p', fechaPeriodo.split('/'));
    const periodo: Date = new Date();
    const mesAndYear = fechaPeriodo.split('/');

    periodo.setMonth(parseInt(mesAndYear[1]) - 1);
    periodo.setFullYear(parseInt(mesAndYear[0]));
    periodo.setDate(1);

    // console.log('PERIODO', periodo);
    console.log('FECHA_*', this.datePipe.transform(fechaPeriodo, 'yyyy-MM-dd'));

    return this.datePipe.transform(fechaPeriodo, 'yyyy-MM-dd');
  }


  dateDiffInDays(a: any, b: any) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  calcularDifDias(fechaFin: any, fechaIni: any){
    const fechaIniDate = new Date(fechaIni);
    const fechaFinDate = new Date(fechaFin);

    const numDias = this.dateDiffInDays( fechaIniDate, fechaFinDate)+1;
    console.log('DIAS', numDias, );
    return numDias;
  }
}




