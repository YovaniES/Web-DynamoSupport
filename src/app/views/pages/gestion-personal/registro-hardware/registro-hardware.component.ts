import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { PersonalService } from 'src/app/core/services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth.service';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { ModalHardwareComponent } from './modal-hardware/modal-hardware.component';
import { FirstCapitalPipe } from '../../../../core/pipes/first-capital.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-registro-hardware',
    templateUrl: './registro-hardware.component.html',
    styleUrls: ['./registro-hardware.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, MatIconModule, MatTooltipModule, NgIf, MatProgressSpinnerModule, NgxPaginationModule, UpperCasePipe, FirstCapitalPipe]
})
export class RegistroHardwareComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userID!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalHardware: number = 0;
  pageSize = 10;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private exportExcellService: ExportExcellService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarHardware();
    this.getListMarcaHardware();
    this.getListTiposHardware();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      id_hardware: [''],
      tipo       : ['', Validators.required],
      marca      : ['', Validators.required],
      serie      : [''],
      imei       : [''],
      estado     : [''],
    })
  }

  getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userId);
    })
   }

  listaHardware: any[] = [];
  cargarOBuscarHardware(){
    this.blockUI.start("Cargando listado de hardware...");
    let parametro: any[] = [{
      "queryId": 108,
      "mapValue": {
        param_id_hardware: this.filtroForm.value.id_hardware,
        param_serie      : this.filtroForm.value.serie,
        param_id_tipo    : this.filtroForm.value.tipo,
        param_id_marca   : this.filtroForm.value.marca,
        param_id_estado  : this.filtroForm.value.estado,
        param_imei       : this.filtroForm.value.imei,
      }
    }];
    this.personalService.cargarOBuscarHardware(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

    //  console.log('Lista-Hardware', resp, resp.list.length);
      this.listaHardware = [];
      this.listaHardware = resp.list;

      this.spinner.hide();
    });
  }

  listTipos: any[] = [];
  getListTiposHardware(){
    let arrayParametro: any[] = [{queryId: 32}];

    this.personalService.getListTiposHardware(arrayParametro[0]).subscribe((resp: any) => {
      this.listTipos = resp.list;
    });
  }


  listMarca: any[] = [];
  getListMarcaHardware(){
    let arrayParametro: any[] = [{ queryId: 33 }];

    this.personalService.getListMarcaHardware(arrayParametro[0]).subscribe((resp: any) => {
      this.listMarca = resp.list;
    });
  }

  abrirEliminarHardware(id: number, estadoRecurso: string, nameHardware: string){
    Swal.fire({
      title: `Eliminar Hardware?`,
      text: `¿Desea eliminar el Hardware: ${nameHardware}?`,
      icon: 'question',
      confirmButtonColor: '#20c997',
      cancelButtonColor : '#b2b5b4',
      confirmButtonText : 'Si!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
        if (resp.value) {
          this.eliminarHardwareAsignado(id, estadoRecurso, nameHardware);
       }
      });
  }

  eliminarHardwareAsignado(idRecurso: number, estadoRecurso: string, nameHardware: string){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 18,
      mapValue: {
        "param_id_hardware": idRecurso,
        "CONFIG_USER_ID"   : this.userID,
        // "CONFIG_OUT_MSG_ERROR":'',
        // "CONFIG_OUT_MSG_EXITO":''
      }
    }];
    this.personalService.eliminarHardware(parametro[0]).subscribe(resp => {

      if (estadoRecurso === 'Disponible') {
        Swal.fire({
          title: 'Eliminar Hardware',
          text: `El Hardware: ${nameHardware}, fue eliminado con éxito`,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: `Eliminar Hardware`,
          text: `El Hardware: ${nameHardware}, no pudo ser eliminado por que se encuentra Asignado al Personal`,
          icon: 'error',
        });
      }
      this.cargarOBuscarHardware();
    });
    this.spinner.hide();
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})
    this.cargarOBuscarHardware();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalHardware) {
      this.personalService.cargarOBuscarHardware(offset.toString()).subscribe( (resp: any) => {
            this.listaHardware = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  exportarRegistro(){
    this.exportExcellService.exportarExcel(this.listaHardware, 'Hardware')
  }

  crearHardware(){
    const dialogRef = this.dialog.open(ModalHardwareComponent, {width:'55%',});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarHardware()
      }
    })
  }

  actualizarHardware(DATA: any) {
    // console.log('DATA_HARDWARE', DATA);
    // this.dialog
      const dialogRef = this.dialog.open(ModalHardwareComponent, {width: '55%', data: DATA});

      dialogRef.afterClosed().subscribe((resp) => {
        if (resp == 'Actualizar') {
          this.cargarOBuscarHardware();
        }
      });
  }
}


