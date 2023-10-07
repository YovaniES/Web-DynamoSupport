import { DatePipe, NgIf, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilService } from 'src/app/core/services/util.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-asignar-vacaciones',
    templateUrl: './asignar-vacaciones.component.html',
    styleUrls: ['./asignar-vacaciones.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, NgIf, NgFor]
})
export class AsignarVacacionesComponent implements OnInit {

  asigVacacionesForm!: FormGroup;

  constructor(
    private vacacionesService: VacacionesPersonalService,
    private authService: AuthService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<AsignarVacacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_VACAC: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.cargarPeriodosByID();
    this.getListEstadoVacaciones();
    this.getListMotivosVacaciones();
    console.log('DATA_VACAC_PERIODO', this.DATA_VACAC, this.DATA_VACAC.vdForm);
    // console.log('ID_PERS_VACAC', this.DATA_VACAC.vacForm.idPersonal); //idPersonal= 496
  }

  newForm(){
    this.asigVacacionesForm = this.fb.group({
      fechaInicio   : ['', [Validators.required]],
      fechaFin      : ['', [Validators.required]],
      id_estado     : [ 2, [Validators.required]],
      estado_periodo: ['Planificado'],
      id_motivo     : [ 5, [Validators.required]], //Motivo_5 : NINGUNO
      dias_periodo  : [''],
      jira          : [''],
      dedicaciones  : [''],
      observaciones : [''],
      // destinatario  : [''],
      // mensaje       : [''],
    })
   }

   selectEstadoCompletado(): boolean{
    let  estadoCompletado = false;

    const estCompletado = this.listVacacionesEstado.find(estado => estado.valor_texto_1.toUpperCase() == 'COMPLETADO');
    if (estCompletado) {
       estadoCompletado = estCompletado.id_correlativo == this.asigVacacionesForm.controls['id_estado'].value;
    }
    // console.log('EST_COMP', estCompletado, estadoCompletado);
    return estadoCompletado;
   }


   selectEstadoCancelado(): boolean{
    let estadoCancelado = false;

    const estCancelado = this.listVacacionesEstado.find(est => est.valor_texto_1.toUpperCase() == 'CANCELADO' )
    if (estCancelado) {
      estadoCancelado = estCancelado.id_correlativo == this.asigVacacionesForm.controls['id_estado'].value; //estadoCancelado == 3
    }
    // console.log('EST_CANCELADO', estadoCancelado, estCancelado);
    return estadoCancelado;
   };

  //  enviarCorreo(){
  //   if (this.asigVacacionesForm.controls['mensaje'].value) {
  //     const body = {
  //       from: 'abc@gmail.com',
  //       to  : this.asigVacacionesForm.controls['destinatario'].value,
  //       body: `<html lang=\"es\"> <head> <meta charset=\"utf-8\" /> <title>REGISTRAR VACACIONES</title> </head><body style=\"background-color: #f8f9fa\"> <table style=\"max-width: 600px; padding: 10px; margin: 0 auto; border-collapse: collapse;\">
  //             <tr> <td style=\"padding: 0\"> <img style=\"padding: 0; display: block\" src=\"assets/images/background/vacaciones-msj.png\" width=\"100%\" height=\"10%\"/> </td> </tr> <tr> <td style=\"background-color: #FFF\">
  //             <div style=\"color: #34495e; margin: 4% 10% 2%; text-align: justify; font-family: sans-serif;\"> <h2 style=\"color: #ffc107; margin: 0 0 7px\"> ALERTA PREVENTIVA </h2>
  //             <p style=\"margin: 2px; font-size: 14px; color: #a6a6a6;\"> ${this.asigVacacionesForm.controls['destinatario'].value} Comunicarle que sus vacaciones ya fueron planificados desde el 1/12/2022 hasta el 23/12/2022. Por favor tener en cuenta. si en caso no realizó dicha petición comunicarse con su jefe directo. <br /> <br /> gracias.
  //             ${this.asigVacacionesForm.controls['mensaje'].value}
  //             </p> <p style=\" color: #b3b3b3; font-size: 12px; text-align: center; margin: 30px 0 0;\"> Copyright © INDRA 2022 </p> </div> </td> </tr> </table> </body> </html>`
  //      }
  //     this.vacacionesService.enviarCorreo(body).subscribe();
  //   }
  //  }

   agregarOactualizarPeriodo(){
    if (!this.DATA_VACAC) {return}

    if (this.DATA_VACAC.isCreation) {
      if (this.asigVacacionesForm.valid) { this.agregarPeriodoVacaciones()}
    } else {
      this.actualizarPeriodo();
    }
   }

   agregarPeriodoVacaciones() {
    this.spinner.show();
    // this.enviarCorreo();

    const formValues = this.asigVacacionesForm.getRawValue();

    let parametro: any =  {queryId: 129, mapValue: {
          p_id_vacaciones        : this.DATA_VACAC.vacForm.idVacaciones.idVac,
          p_id_persona           : this.DATA_VACAC.vacForm.idVacaciones.id_persona ,
          p_fecha_per_ini        : moment.utc(formValues.fechaInicio).format('YYYY-MM-DD'),
          p_fecha_per_fin        : moment.utc(formValues.fechaFin).format('YYYY-MM-DD'),
          p_id_per_estado        : formValues.id_estado ,
          p_id_per_motivo        : formValues.id_motivo ,
          p_observacion          : formValues.observaciones ,
          p_id_usuario_asignacion: this.userID ,
          p_fecha_per_creacion   : '' ,
          p_id_sist_vac          : this.DATA_VACAC.vacForm.idVacaciones.id_sist_vac,
          p_jira                 : formValues.jira? 1 : 0,
          p_dedicaciones         : formValues.dedicaciones? 1 : 0 ,
          CONFIG_USER_ID         : this.userID ,
          CONFIG_OUT_MSG_ERROR   : '' ,
          CONFIG_OUT_MSG_EXITO   : ''
        },
      };
    //  console.log('VAOR_VACA', this.asigVacacionesForm.value , parametro);
    this.vacacionesService.agregarPeriodoVacaciones(parametro).subscribe((resp: any) => {
    this.spinner.hide();

      Swal.fire({
        title: 'Planificar vacaciones!',
        text : `La vacación fue planificado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok',
      });

      this.close(true);
    });
  }

  isEstadoCancelado(): boolean{
    const estadoCancelado = this.listVacacionesEstado.find(e => e.valor_texto_1.toUpperCase() == 'CANCELADO')
    return estadoCancelado && estadoCancelado.id_correlativo == this.asigVacacionesForm.controls['id_estado'].value;
  }


  esEstadoCompletado(): boolean{
   const estadoCompletado =  this.listVacacionesEstado.find(estado => estado.valor_texto_1.toUpperCase() == 'COMPLETADO');
    // console.log('EST_COMPLETADO', estadoCompletado);

   return estadoCompletado && estadoCompletado.id_correlativo == this.asigVacacionesForm.controls['id_estado'].value
  }

  actualizarPeriodo() {
    this.spinner.show();
    // this.enviarCorreo();

    const formValues = this.asigVacacionesForm.getRawValue();
    console.log('EST', this.asigVacacionesForm.value);

    let parametro: any[] = [{ queryId: 131,
        mapValue: {
          p_idPeriodoVac         : this.DATA_VACAC.id_periodo,
          p_id_vacaciones        : this.DATA_VACAC.id_vacaciones ,
          p_id_persona           : this.DATA_VACAC.id_persona ,
          p_fecha_per_ini        : moment.utc(formValues.fechaInicio).format('YYYY-MM-DD'),
          p_fecha_per_fin        : moment.utc(formValues.fechaFin).format('YYYY-MM-DD'),
          p_id_per_estado        : formValues.id_estado ,
          p_id_per_motivo        : formValues.id_motivo ,
          p_observacion          : formValues.observaciones ,
          p_id_usuario_asignacion: this.userID ,
          p_fecha_per_creacion   : '' ,
          p_id_sist_vac          : this.DATA_VACAC.id_sist,
          p_jira                 : formValues.jira?  1: 0 ,
          // p_jira                 : formValues.jira && this.esEstadoCompletado()?  1: 0 ,
          p_dedicaciones         : formValues.dedicaciones? 1: 0 ,
          CONFIG_USER_ID         : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: ''
        },
      }];
     this.vacacionesService.actualizarPeriodo(parametro[0]).subscribe({next: (res) => {
        this.spinner.hide();
        this.cargarPeriodosByID();

        this.close(true)
          Swal.fire({
            title: 'Actualizar periodo!',
            text : `El Periodo fue actualizado con éxito`,
            icon : 'success',
            confirmButtonText: 'Ok'
            });

          this.asigVacacionesForm.reset();
          this.dialogRef.close('Actualizar');
        }, error:()=>{
          Swal.fire(
            'ERROR',
            'No se pudo actualizar el periodo',
            'warning'
          );
        }
     });
  }

  totalDiasPlanificado(){
    const fechaIni = moment.utc(this.asigVacacionesForm.controls['fechaInicio'].value).format('YYYY-MM-DD')
    const fechaFin = moment.utc(this.asigVacacionesForm.controls['fechaFin'   ].value).format('YYYY-MM-DD')

    if (fechaIni && fechaFin) {
      const numDias = this.utilService.calcularDifDias( fechaFin, fechaIni)

      this.asigVacacionesForm.controls['dias_periodo'].setValue(numDias)
      console.log('DIAS_PARAM', numDias);
    }
  }

  // setearMsjAobligatorio(){
  //   this.asigVacacionesForm.controls['mensaje'].setValidators(Validators.required);
  //   this.asigVacacionesForm.controls['mensaje'].updateValueAndValidity();
  // }
  // setearMsjNoObligatorio(){
  //   this.asigVacacionesForm.controls['mensaje'].clearValidators();
  //   this.asigVacacionesForm.controls['mensaje'].updateValueAndValidity();
  // }

  // cambiarEstado(){
  //   if (this.asigVacacionesForm.controls['id_estado'].value != this.estadoInicial) {
  //     this.setearMsjAobligatorio();
  //   }else{
  //     this.setearMsjNoObligatorio();
  //   }
  // }

  estadoInicial: any;
  titleBtn: string = 'Agregar';
  cargarPeriodosByID(){
    if (!this.DATA_VACAC.isCreation) {
      this.titleBtn = 'Actualizar'
      this.asigVacacionesForm.controls['id_motivo'    ].setValue(this.DATA_VACAC.id_per_motivo);
      this.asigVacacionesForm.controls['id_estado'    ].setValue(this.DATA_VACAC.id_per_estado);

      this.estadoInicial = this.DATA_VACAC.id_per_estado;

      this.asigVacacionesForm.controls['jira'         ].setValue(this.DATA_VACAC.jira);
      this.asigVacacionesForm.controls['dedicaciones' ].setValue(this.DATA_VACAC.dedicaciones);
      this.asigVacacionesForm.controls['observaciones'].setValue(this.DATA_VACAC.observacion);
      this.asigVacacionesForm.controls['dias_periodo' ].setValue(this.DATA_VACAC.cant_dias_periodo);
      // this.asigVacacionesForm.controls['destinatario' ].setValue(this.DATA_VACAC.correo);
      // this.setearMsjNoObligatorio()

      if (this.DATA_VACAC.fecha_inicio !='null' && this.DATA_VACAC.fecha_inicio != '') {
          let fecha_x = this.DATA_VACAC.fecha_inicio
          const str   = fecha_x.split('/');
          const year  = Number(str[2]);
          const month = Number(str[1]);
          const date  = Number(str[0]);
          this.asigVacacionesForm.controls['fechaInicio'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }

      if (this.DATA_VACAC.fecha_fin !='null' && this.DATA_VACAC.fecha_fin != '') {
        let fecha_x = this.DATA_VACAC.fecha_fin
        const str   = fecha_x.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.asigVacacionesForm.controls['fechaFin'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }
    } else {
    // this.asigVacacionesForm.controls['destinatario' ].setValue(this.DATA_VACAC.vacForm.correo);
    // this.setearMsjAobligatorio();

    console.log('DATOS', this.asigVacacionesForm.value);
    }
  }

  listVacacionesEstado: any[] = [];
  getListEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 132}];
  this.vacacionesService.getListEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listVacacionesEstado = resp.list;
    // console.log('VACAS-ESTADO', resp.list);
    })
  }

  listVacacionesMotivo: any[] = [];
  getListMotivosVacaciones(){
  let parametro: any[] = [{ queryId: 125}];
  this.vacacionesService.getListMotivosVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listVacacionesMotivo = resp.list;
    // console.log('VACAS-MOTIVO', resp.list);
    })
  }

   userID: number = 0;
   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.result.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

  campoNoValido(campo: string): boolean {
    if (this.asigVacacionesForm.get(campo)?.invalid && this.asigVacacionesForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}

