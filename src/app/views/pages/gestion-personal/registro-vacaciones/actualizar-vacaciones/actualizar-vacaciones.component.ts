import { DatePipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';
import { AsignarVacacionesComponent } from './asignar-vacaciones/asignar-vacaciones.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@Component({
    selector: 'app-actualizar-vacaciones',
    templateUrl: './actualizar-vacaciones.component.html',
    styleUrls: ['./actualizar-vacaciones.component.scss'],
    standalone: true,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      NgFor,
      NgIf,
      MatTooltipModule,
      MatIconModule,
      MatFormFieldModule,
      MatProgressSpinnerModule,
      UpperCasePipe,
      MatDatepickerModule,
      MatNativeDateModule,
      MatMomentDateModule,
    ]
})

export class ActualizarVacacionesComponent implements OnInit {
  // moment().format("L"); 16/02/2021
  listVacacionesPeriodo: any[]= [];

  minDate = new Date();
  maxDate = new Date(2022, 9, 9);

  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  vacacionesForm!: FormGroup;
  idVac:string = 'VAC-00123';

  constructor(
    private vacacionesService: VacacionesPersonalService,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ActualizarVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_VACACIONES: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUsuario();
    this.getListEstadoVacaciones();
    this.getListSistemaVacaciones();
    this.getListTipoVacaciones();
    this.cargarPeriodoVacaciones(false);
    this.getHistoricoCambiosEstado(this.DATA_VACACIONES);
    // console.log('DATA_VACACIONES', this.DATA_VACACIONES);
    // console.log('ID_DATA_VACACIONES', this.DATA_VACACIONES.id_vacaciones);
    this.vacacionesForm.controls['idVacaciones'].setValue(this.DATA_VACACIONES)

    this.cargarVacacionesById()
  }

    newForm(){
      this.vacacionesForm = this.fb.group({
       nombre        : ['', [Validators.required]],
       apellidos     : [''],
       codCorp       : [''],
       fechaInicVac  : [''],
       fechaFinVac   : [''],
       id_proyecto   : [''],
       estado_persona: [''],
       proyecto      : [''],
       id_estado_vac : [''],
       estado_vac    : [''],
       idSistema     : [''],
       idTipoVac     : [''],
       periodoVac    : [''],
       fecha_ingreso : [''],
       total_dias_vac: [''],
       idVacaciones  : [''],
       correo        : [''],
      })
     }

  getFechaIni(event: any){
    console.log('FECHA-INI-IMPUT', event.target.value);
  }

  getFechaInit(e: any){
    console.log('F_INI', e.target.value);
  }

  actualizarVacaciones(estadoVacaciones?: number ){
    this.spinner.show();

    const formValues = this.vacacionesForm.getRawValue();

    let parametro: any[] = [{
        queryId: 138,
        mapValue: {
          p_idVac             : this.DATA_VACACIONES.idVac,
          p_id_persona        : this.DATA_VACACIONES.id_persona,
          p_id_sist_vac       : formValues.idSistema,
          p_id_tipo           : formValues.idTipoVac,
          p_fecha_ini_vac     : moment.utc(formValues.fechaInicVac).format('YYYY-MM-DD'),
          p_fecha_fin_vac     : moment.utc(formValues.fechaFinVac).format('YYYY-MM-DD'),
          p_id_estado_vac     : estadoVacaciones? estadoVacaciones : formValues.id_estado_vac,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: ''
        },
      }];
    this.vacacionesService.actualizarVacaciones(parametro[0]).subscribe( resp => {
      this.spinner.hide();
      // console.log('DATA_ACTUALIZADO', resp);
      this.cargarVacacionesById();

      Swal.fire({
        title: 'Actualizar Vacaciones!',
        text : `La vacación de: ${ formValues.nombre } ${ formValues.apellidos }, fue actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })

        if (!estadoVacaciones) {
          this.close(true);
        }else{
        this.getHistoricoCambiosEstado(this.DATA_VACACIONES);
        }
    });
  };

  cargarVacacionesById(){
    this.spinner.show();

    let arrayParametro:any[] = [{
      "queryId": 146,
      "mapValue": {
        "param_id_vacaciones": this.DATA_VACACIONES.idVac
      }
    }];
    this.vacacionesService.cargarVacacionesById(arrayParametro[0]).subscribe((resp: any) => {
      console.log('DATA_BY_ID', resp.list);
      this.vacacionesForm.controls['nombre'        ].setValue(resp.list[0].nombres);
      this.vacacionesForm.controls['apellidos'     ].setValue(resp.list[0].apellidos);
      this.vacacionesForm.controls['correo'        ].setValue(resp.list[0].correo);
      this.vacacionesForm.controls['codCorp'       ].setValue(resp.list[0].codigo_corporativo);
      this.vacacionesForm.controls['proyecto'      ].setValue(resp.list[0].codigo_proyecto);
      this.vacacionesForm.controls['id_proyecto'   ].setValue(resp.list[0].id_proyecto);
      this.vacacionesForm.controls['estado_persona'].setValue(resp.list[0].estado_persona);
      this.vacacionesForm.controls['id_estado_vac' ].setValue(resp.list[0].id_estado_vac);
      this.vacacionesForm.controls['estado_vac'    ].setValue(resp.list[0].estado_vac);
      this.vacacionesForm.controls['idSistema'     ].setValue(resp.list[0].id_sist_vac);
      this.vacacionesForm.controls['idTipoVac'     ].setValue(resp.list[0].id_tipo_vac);
      this.vacacionesForm.controls['total_dias_vac'].setValue(resp.list[0].cant_dias_vac);
      this.vacacionesForm.controls['fecha_ingreso' ].setValue(resp.list[0].fecha_ingreso);

      if (resp.list[0].fecha_ini_vac) {
        let fecha_x = resp.list[0].fecha_ini_vac
        const str   = fecha_x.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.vacacionesForm.controls['fechaInicVac'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }

      if (resp.list[0].fecha_fin_vac) {
        let fecha_x = resp.list[0].fecha_fin_vac
        const str   = fecha_x.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.vacacionesForm.controls['fechaFinVac'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }
    this.spinner.hide();
    }
  )}

  eliminarPeriodoVacaciones(id: number){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 141,
      "mapValue": {
        "p_idPeriodoVac"      : id,
        "CONFIG_USER_ID"      : this.userID,
        "CONFIG_OUT_MSG_ERROR": '',
        "CONFIG_OUT_MSG_EXITO": ''
      }
    }];
      Swal.fire({
        title: 'Eliminar periodo?',
        text: `¿Estas seguro que desea eliminar el periodo?`,
        icon: 'question',
        confirmButtonColor: '#20c997',
        cancelButtonColor : '#b2b5b4',
        confirmButtonText : 'Si, Eliminar!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((resp) => {
        if (resp.value) {
          this.vacacionesService.eliminarPeriodoVacaciones(parametro[0]).subscribe((resp: any) => {

            if (resp && resp.exitoMessage) {
              this.cargarPeriodoVacaciones();

              Swal.fire({
                title: 'Eliminar periodo',
                text : `El periodo fue eliminado con éxito`,
                icon : 'success',
              });
            }
          });
        }
    });
    this.spinner.hide();
  }

  totalDiasVac(){
    const fechaIni = moment.utc(this.vacacionesForm.controls['fechaInicVac'].value).format('YYYY-MM-DD')
    const fechaFin = moment.utc(this.vacacionesForm.controls['fechaFinVac' ].value).format('YYYY-MM-DD')

    if (fechaIni && fechaFin) {
      const numDias = this.utilService.calcularDifDias( fechaFin, fechaIni)

      this.vacacionesForm.controls['total_dias_vac'].setValue(numDias)
      // console.log('DIAS_ESTADO', numDias);
    }
  }

  cargarPeriodoVacaciones(validarEstadosPeriodos: boolean = true){
    this.listVacacionesPeriodo = [];

    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 128,
      "mapValue": {
      "p_id_vacaciones": this.DATA_VACACIONES.idVac,
      }
    }];

    this.vacacionesService.cargarPeriodoVacaciones(parametro[0]).subscribe( (resp: any) => {
      this.listVacacionesPeriodo = resp.list;
      console.log('PERIODOS-PLANIFICADAS', resp.list);

        if (validarEstadosPeriodos) {
          this.validarEstadoPeriodo(this.listVacacionesPeriodo)
        }
    })
  }

  buscarEstadoPorDescripcion(descripcion: string): any{
    return this.listVacacionesEstado.find( estado => estado.valor_texto_1.toUpperCase() == descripcion)
  }

  existeItemNoCancelado(listVacacionesPeriodo: any[]): boolean{
    return listVacacionesPeriodo.find(periodo => periodo.vac_estado.toUpperCase() != 'CANCELADO')
  }

  validarEstadoPeriodo(listVacacionesPeriodo: any[]){
      const existePeriodoPlanificado = listVacacionesPeriodo.find(periodo => periodo.vac_estado.toUpperCase() == 'PLANIFICADO')

      // console.log('PERIODO_PLANI', existePeriodoPlanificado, this.listVacacionesEstado);

      if (existePeriodoPlanificado) {
        this.validarEstadoPorDescripcion('Planificado');
      } else if ( !this.existeItemNoCancelado(listVacacionesPeriodo) || this.listVacacionesPeriodo.length == 0 ) {
        this.validarEstadoPorDescripcion('Registrado')
      } else {
        this.validarEstadoCompletado(listVacacionesPeriodo);
      }
  }

  validarEstadoPorDescripcion(descripcion: string){
    const idEstadoRegistrado = this.buscarEstadoPorDescripcion(descripcion.toUpperCase());
    if (idEstadoRegistrado) {
      // console.log('ID_EST_PLANIF', idEstadoRegistrado);
      this.actualizarVacaciones(idEstadoRegistrado.id_correlativo);
    }
  }

  validarEstadoCompletado(listVacacionesPeriodo: any[]){
    const cantidadDiasCompletados = this.acumularDiasCompletados(listVacacionesPeriodo);

    // console.log('DIAS_COMPL', cantidadDiasCompletados, this.vacacionesForm.controls['total_dias_vac'].value);
    if (cantidadDiasCompletados == this.vacacionesForm.controls['total_dias_vac'].value) {
    const idEstadoCompletado = this.buscarEstadoPorDescripcion('COMPLETADO');

    this.actualizarVacaciones(idEstadoCompletado.id_correlativo);
    } else {
      this.validarEstadoPorDescripcion('En Gestión')
    }
  }

  acumularDiasCompletados(listVacacionesPeriodo: any[]): number{
    let cantidadDiasCompletados = 0;
    listVacacionesPeriodo.map( periodo => {
      if (periodo.vac_estado.toUpperCase() == 'COMPLETADO') {
        cantidadDiasCompletados = cantidadDiasCompletados + periodo.cant_dias_periodo;
      }
    });
    return cantidadDiasCompletados;
  }

  listVacacionesEstado: any[] = [];
  getListEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 124}];
  this.vacacionesService.getListEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listVacacionesEstado = resp.list;
    // console.log('VACAS-ESTADO', resp.list);
    })
  }

  histCambiosEstado: any[] = [];
  getHistoricoCambiosEstado(id: number){
  this.spinner.show();
    let parametro: any[] = [{
      queryId: 139,
      mapValue: {p_id_vacaciones: this.DATA_VACACIONES.idVac}
    }];

    this.vacacionesService.getHistoricoCambiosEstado(parametro[0]).subscribe((resp: any) => {
      this.histCambiosEstado = resp.list;
      // console.log('HistCambEstado', resp.list)
    });
    this.spinner.hide();
  }

  listSistemaVacaciones: any[] = [];
  getListSistemaVacaciones(){
  let parametro: any[] = [{ queryId: 126}];
  this.vacacionesService.getListSistemaVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listSistemaVacaciones = resp.list;
    // console.log('SISTEMA-ASIG_VAC', resp.list);
    })
  }

  listTipoVacaciones: any[] = [];
  getListTipoVacaciones(){
  let parametro: any[] = [{ queryId: 151}];
  this.vacacionesService.getListTipoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listTipoVacaciones = resp.list;
    console.log('TIPO_VAC', resp.list);
    })
  }

  userID: number = 0;
  getUsuario(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.result.user.userId;
     // console.log('ID-USER', this.userID);
   })
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  campoNoValido(campo: string): boolean {
    if ( this.vacacionesForm.get(campo)?.invalid && (this.vacacionesForm.get(campo)?.dirty || this.vacacionesForm.get(campo)?.touched) ) {
      return true;
    } else {
      return false;
    }
  }

  asignarVacaciones(){
    const diasVacaciones = this.utilService.calcularDifDias(this.vacacionesForm.controls['fechaFinVac'].value, this.vacacionesForm.controls['fechaInicVac'].value);
    // console.log('FORMULARIO', this.vacacionesForm.value, this.utilService.calcularDifDias(this.vacacionesForm.controls['fechaFinVac'].value, this.vacacionesForm.controls['fechaInicVac'].value));
    const dialogRef = this.dialog.open(AsignarVacacionesComponent, { width:'35%', data: {vacForm: this.vacacionesForm.value, isCreation: true, diasVacaciones: diasVacaciones} });

    dialogRef.afterClosed().subscribe(resp => {
      console.log('CLOSE', resp);

      if (resp) {
        this.cargarPeriodoVacaciones()
      }
    })
  };

  actualizarPeriodoVacaciones(DATA: any){
    console.log('DATA_VACACIONES', DATA);

    const dataForm = {...DATA, correo: this.vacacionesForm.value.correo, fullName: this.vacacionesForm.value.nombres}
    console.log('DATA_FOR', dataForm);

    const dialogRef = this.dialog.open(AsignarVacacionesComponent, { width:'35%', data: dataForm});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarPeriodoVacaciones()
      }
    })
  };
}

