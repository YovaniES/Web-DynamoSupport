import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { VisorService } from 'src/app/core/services/visor.service';

@Component({
  selector: 'app-modal-dpf-pendiente',
  templateUrl: './modal-dpf-pendiente.component.html',
  styleUrls: ['./modal-dpf-pendiente.component.scss']
})
export class ModalDpfPendienteComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  loadingItem: boolean = false;

  constructor(
    private visorServices: VisorService,
    @Inject(MAT_DIALOG_DATA) public PROY_BY_GESTOR: any
  ) {}

  ngOnInit(): void {
    this.getListPendienteByGestor();
    // console.log('PROY_BY_GESTOR', this.PROY_BY_GESTOR);
  }

  proyectoPendiente: string = 'ENTEQA';
  proyectoReg: string = '';
  listPendienteByGestor: any[] = [];
  dataInicial: any[] = [];
  getListPendienteByGestor(){
    this.blockUI.start('Cargando Deuda de los gestores');
    this.visorServices.getListPendienteByGestor().subscribe((resp: any[]) => {
      this.blockUI.stop();

      this.dataInicial = resp;
      this.listPendienteByGestor = resp.filter(x=>(x.pendiente > 5 || x.pendiente < -5) && x.proyecto == this.PROY_BY_GESTOR );
      // console.log('DATA-PEND_BYGESTOR', this.listPendienteByGestor);
    })
  }
}
