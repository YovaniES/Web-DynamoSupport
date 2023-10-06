import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/core/services/auth.service';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { ModalCuentaComponent } from './modal-cuenta/modal-cuenta.component';
import { PersonalService } from 'src/app/core/services/personal.service';
import { FirstCapitalPipe } from '../../../../core/pipes/first-capital.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-registro-cuenta',
    templateUrl: './registro-cuenta.component.html',
    styleUrls: ['./registro-cuenta.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgFor, MatIconModule, MatTooltipModule, NgIf, MatProgressSpinnerModule, NgxPaginationModule, UpperCasePipe, FirstCapitalPipe]
})
export class RegistroCuentaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  userID!: number;
  filtroForm!: FormGroup;

  page = 1;
  totalIniciativa: number = 0;
  pageSize = 10;
  // pageSizes = [3, 6, 9];

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.cargarOBuscarcuentas();
    this.getListTiposCuentas();
    this.getUsuario();
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      usuario : ['', Validators.required],
      idEstado: [''],
      id_tipo : ['']
    })
  }

  getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userId);
    })
   }


  listaCuenta: any[] = [];
  cargarOBuscarcuentas(){
    this.blockUI.start("Cargando cuentas...");
    let parametro: any[] = [{
      "queryId": 109,
      "mapValue": {
        param_usuario  : this.filtroForm.value.usuario,
        param_id_estado: this.filtroForm.value.idEstado,
        param_id_tipo  : this.filtroForm.value.id_tipo
      }
    }];
    this.personalService.cargarOBuscarcuentas(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Cuentas', resp, resp.list.length);
      this.listaCuenta = [];
      this.listaCuenta = resp.list;

      this.spinner.hide();
    });
  }

  abrirEliminarCuenta(id: number, estado: string, nameUser: string){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 42,
      mapValue: {
        param_id_cuenta: id,
        CONFIG_USER_ID: this.userID,
        CONFIG_OUT_MSG_ERROR: "",
        CONFIG_OUT_MSG_EXITO: "",
      }
    }];
    Swal.fire({
      title: '¿Eliminar Cuenta?',
      text: `¿Estas seguro que deseas eliminar la Cuenta: ${nameUser}?`,
      icon: 'question',
      confirmButtonColor: '#ec4756',
      cancelButtonColor: '#0d6efd',
      confirmButtonText: 'Si, Eliminar!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
      if (resp.value) {
        this.eliminarHardwareAsignado(id, estado, nameUser);
      }
    });
    this.spinner.hide();
  }

  eliminarHardwareAsignado(idRecurso: number, estadoRecurso: string, nameUser: string){
    this.spinner.show();

    let parametro:any[] = [{
      queryId: 42,
      mapValue: {
        "param_id_cuenta": idRecurso,
        "CONFIG_USER_ID"   : this.userID,
        // "CONFIG_OUT_MSG_ERROR":'',
        // "CONFIG_OUT_MSG_EXITO":''
      }
    }];
    this.personalService.eliminarCuenta(parametro[0]).subscribe(resp => {

      if (estadoRecurso === 'Disponible') {
        Swal.fire({
          title: 'Eliminar Cuenta',
          text: `La Cuenta: ${nameUser}, fue eliminado con éxito`,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: `Eliminar Cuenta`,
          text: `La Cuenta: ${nameUser}, no pudo ser eliminado por que se encuentra Asignado al Personal`,
          icon: 'error',
        });
      }
      this.cargarOBuscarcuentas();
    });
    this.spinner.hide();
  }

  tipos: any[] = [];
  getListTiposCuentas() {
    let Parametro: any[] = [{ queryId: 40}];
    this.personalService.getListTiposCuentas(Parametro[0]).subscribe((resp: any) => {
      this.tipos = resp.list;
      // console.log('TIPOS', resp);
    });
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})

    this.cargarOBuscarcuentas();
  }

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalIniciativa) {
      this.personalService.cargarOBuscarcuentas(offset.toString()).subscribe( (resp: any) => {
            this.listaCuenta = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  exportarRegistro(){
    this.exportExcellService.exportarExcel(this.listaCuenta, 'Cuenta')
  }

  crearCuenta(){
    const dialogRef = this.dialog.open(ModalCuentaComponent, {width:'50%'});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarOBuscarcuentas()
      }
    })
  }

  actualizarCuenta(DATA: any) {
    console.log('DATA_CUENTA', DATA);

    const dialogRef = this.dialog.open(ModalCuentaComponent, { width: '50%', data: DATA});

    dialogRef.afterClosed().subscribe((resp) => {
        if (resp == 'Actualizar') {
          this.cargarOBuscarcuentas();
        }
      });
  }

}
