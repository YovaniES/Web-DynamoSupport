import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PersonalService } from 'src/app/core/services/personal.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { ExportExcellService } from 'src/app/core/services/export-excell.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import { ActualizarVacacionesComponent } from './actualizar-vacaciones/actualizar-vacaciones.component';
import { CrearVacacionesComponent } from './crear-vacaciones/crear-vacaciones.component';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth.service';
import { EnviarCorreoComponent } from './enviar-correo/enviar-correo.component';
import { FirstCapitalPipe } from '../../../../core/pipes/first-capital.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-registro-vacaciones',
  templateUrl: './registro-vacaciones.component.html',
  styleUrls: ['./registro-vacaciones.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule,
    NgIf,
    MatProgressSpinnerModule,
    NgxPaginationModule,
    UpperCasePipe,
    FirstCapitalPipe,
    MatNativeDateModule
  ],
})

export class RegistroVacacionesComponent implements OnInit {


  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  vacacionesForm!: FormGroup;

  page = 1;
  totalVacaciones: number = 0;
  pageSize = 10;

  constructor(
    private personalService: PersonalService,
    public authService: AuthService,
    private vacacionesService: VacacionesPersonalService,
    private exportExcellService: ExportExcellService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.newFilfroForm();
    this.getUsuario();
    this.cargarOBuscarVacaciones();
    this.getListProyectos();
    this.getListEstadoVacaciones();
    this.getListAdminVacaciones();
    this.getCantDias();
  }

    newFilfroForm(){
    this.vacacionesForm = this.fb.group({
      cod_corp       : [''],
      nombres        : [''],
      apellidos      : [''],
      id_cod_proy    : [''],
      id_responsable : [''],
      id_estado_vac  : [''],
      id_sist_vac    : [''],
      fechaCreaVacIni: [''],
      fechaCreaVacFin: [''],
    })
  };

  listaRegVacaciones: any[] = [];
  cargarOBuscarVacaciones(){
    this.blockUI.start("Cargando Lista de Vacaciones...");
    let parametro: any[] = [{
      "queryId": 133,
      "mapValue": {
          nombre         : this.vacacionesForm.value.nombres + " " + this.vacacionesForm.value.apellidos,
          id_estado_vac  : this.vacacionesForm.value.id_estado_vac,
          cod_corp       : this.vacacionesForm.value.cod_corp,
          id_responsable : this.authService.getUserNameByRol(this.vacacionesForm.controls['id_responsable'].value ),
          codigo_proyecto: this.vacacionesForm.value.id_cod_proy,
          sist_vac       : this.vacacionesForm.value.id_sist_vac,
          inicio         : this.datepipe.transform(this.vacacionesForm.value.fechaCreaVacIni,"yyyy/MM/dd"),
          fin            : this.datepipe.transform(this.vacacionesForm.value.fechaCreaVacFin,"yyyy/MM/dd"),
      }
    }];
    this.vacacionesService.cargarOBuscarVacaciones(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();
    //  console.log('LISTA-VACACIONES', resp, resp.list.length);

      this.listaRegVacaciones = [];
      this.listaRegVacaciones = resp.list;

      this.spinner.hide();
    });
  }

  abrirEliminarLogico(id: number, name: string, ap_paterno: string){
    Swal.fire({
      title: `Eliminar vacaciones?`,
      text: `¿Desea eliminar la vacación de: ${name} ${ap_paterno}?`,
      icon: 'question',
      confirmButtonColor: '#20c997',
      cancelButtonColor : '#b2b5b4',
      confirmButtonText : 'Si!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {
        if (resp.value) {
          this.eliminacionLogica(id, name, ap_paterno);
       }
      });
  }

  eliminacionLogica(id: number, name: string, ap_paterno: string){
    this.spinner.show();
    let parametro:any[] = [{
      "queryId" : 142,
      "mapValue": { p_idVac : id }
    }];

    this.vacacionesService.eliminarVacaciones(parametro[0]).subscribe(resp => {
      const arrayData:any[] = Array.of(resp);
      let msj  = arrayData[0].exitoMessage;
      let msj2 = arrayData[0].errorMessage

      if(msj == undefined){msj = ''}

      if (msj != '') {
        Swal.fire({
          title: 'Eliminar vacaciones',
          text: `La vacación de: ${name} ${ap_paterno}, fue eliminado con éxito`,
          icon: 'success',
        });

      }else if (msj2 != ''){
        Swal.fire({
          title: `Eliminar vacaciones`,
          text : `La vacación de: ${name} ${ap_paterno}, no pudo ser eliminado por que tiene vacaciones planificadas y/o completadas`,
          icon : 'error',
        });
      }else{
        // this.showError('Error');
      }
      this.cargarOBuscarVacaciones();
    });
    this.spinner.hide();
  }

  difference(date1: any, date2: any) {
    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const day = 1000*60*60*24;

    return(date2utc - date1utc)/day
  }

  cantDias: number = 0;
  getCantDias(){
    const date1 = new Date("2020-12-3");
    const date2 = new Date("2020-12-31");

    this.cantDias = this.difference(date1 , date2)
  }

  listCodProy: any[] = [];
  getListProyectos() {
    let arrayParametro: any[] = [{ queryId: 1 }];

    this.personalService.getListProyectos(arrayParametro[0]).subscribe((resp: any) => {
        this.listCodProy = resp.list;
        // console.log('COD_PROY', resp);
      });
  }

  listEstadoVacaciones: any[] = [];
  getListEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 124}];
  this.vacacionesService.getListEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listEstadoVacaciones = resp.list;
    // console.log('VACAC-ESTADO', resp.list);
    })
  }

  listAdminVacaciones: any[] = [];
  getListAdminVacaciones(){
  let parametro: any[] = [{ queryId: 127}];
  this.vacacionesService.getListAdminVacaciones(parametro[0]).subscribe((resp: any) => {

    if (this.userID == 341 || this.userID == 465) { //WILMER Y CRISTIAN
      this.listAdminVacaciones = resp.list.filter((v:any) => v.username == 'camarcas' || v.username == 'wgil' );
    }

    if (this.userID == 343 || this.userID == 30 || this.userID == 108) { //SERGIO
      this.listAdminVacaciones = resp.list.filter((v:any) => v.username == 'lmquispe' || v.username == 'ecarrospide'|| v.username == 'saleon' );
      console.log('USER-RESP', this.listAdminVacaciones);
    }

    if (this.userID == 436 || this.userID == 168 || this.userID == 454) { //MARCELA
      this.listAdminVacaciones = resp.list.filter((v:any) => v.username == 'admeza' || v.username == 'kdloayza' || v.username == 'imcanelo' );
    }

    if (this.authService.esUsuarioSuperAdmin() || this.authService.esUsuarioCoordTdp()) {
        this.listAdminVacaciones = resp.list;
    }

    })
  }


  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event * 10;
    this.spinner.show();

    if (this.totalfiltro != this.totalVacaciones) {
      this.vacacionesService.cargarOBuscarVacaciones(offset.toString())
        .subscribe((resp: any) => {
          this.listaRegVacaciones = resp.list;
          this.spinner.hide();
        });
    } else {
      this.spinner.hide();
    }
    this.page = event;
  }

  limpiarFiltro() {
    this.vacacionesForm.reset('', {emitEvent: false})
    this.newFilfroForm();

    this.cargarOBuscarVacaciones();
  };

  exportarRegistro() {
    this.exportExcellService.exportarExcel(this.listaRegVacaciones, 'Vacaciones');
  }

  enviarCorreo() {
    const dialogRef = this.dialog.open(EnviarCorreoComponent, { width: '55%', });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        // this.cargarOBuscarEvento();
      }
    });
  }

  userID: number = 0;
  userLogeado: string = '';
  getUsuario(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   =  resp.result.user.userId;
    //  this.userID   = resp.result,  resp.result.user.userId;
     this.userLogeado = `${resp.result.user.nombres} ${resp.result.user.apellidoPaterno}`
    //  console.log('USER_lOGEADO', this.userID, this.userLogeado);
    //  console.log('USER_ID_LOG', this.userID);
   })
  };

  crearVacaciones() {
    const dialogRef = this.dialog.open(CrearVacacionesComponent, {width: '55%',});

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.cargarOBuscarVacaciones();
      }
    });
  }

  actualizarVacaciones(DATA: any) {
    // console.log('DATA_PERSONA_VACACIONES', DATA);
    this.dialog
      .open(ActualizarVacacionesComponent, {width: '65%', height: '75%', data: DATA, disableClose: true})
      .afterClosed().subscribe((resp) => {
        // if (resp) {
        //   this.cargarOBuscarVacaciones();
        // }
          this.cargarOBuscarVacaciones();
      });
  }
}


