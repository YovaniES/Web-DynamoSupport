import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { NgFor, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-modal-comentario',
    templateUrl: './modal-comentario.component.html',
    styleUrls: ['./modal-comentario.component.scss'],
    standalone: true,
    imports: [NgFor, DecimalPipe]
})
export class ModalComentarioComponent implements OnInit {
  loadingItem: boolean = false;

  constructor(
    private facturacionService: FacturacionService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public ID_FACTURA: any
  ) {
  }

  ngOnInit(): void {
    this.listaComentarioByID();
    console.log('ID_FACTURA', this.ID_FACTURA);

  }

  gestorReg: string = '';
  proyectoReg: string = '';
  listcomentario: any[] = [];
  listaComentarioByID(){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 153,
      "MapValue": {
        "p_idFactura": this.ID_FACTURA
      }
    }];
    this.facturacionService.listaComentarioByID(parametro[0]).subscribe((resp: any) => {
      this.listcomentario = resp.list;
      this.gestorReg = resp.list[0].gestor;
      this.proyectoReg = resp.list[0].proyecto;
      // this.idFactura = resp.list[0].idFactura;

     console.log("comentario_regularizacion", resp.list);
    //  console.log("comentario_title", this.idFactura);
      this.spinner.hide();
    });
  }
}
