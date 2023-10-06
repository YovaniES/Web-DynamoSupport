import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-liquidacion',
  templateUrl: './crear-liquidacion.component.html',
  styleUrls: ['./crear-liquidacion.component.scss']
})
export class CrearLiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  userID: number = 0;
  facturaForm!: FormGroup;

  constructor(
    private facturacionService: FacturacionService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private utilService: UtilService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<CrearLiquidacionComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_DUPLICIDAD: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListProyectos();
    this.getUserID();
    this.getListEstados();
    this.getListLiquidaciones();
    this.getListGestores();
    this.cargarDuplicidadByID();
    console.log('DUPLICAR',this.DATA_DUPLICIDAD );
  }

  newForm(){
    this.facturaForm = this.fb.group({
     id_liquidacion : [676,[Validators.required]], //tipoLiq=676 : ACTA
     id_proyecto    : ['',[Validators.required]],
     subservicio    : ['',[Validators.required]],
     id_gestor      : ['',[Validators.required]],
     venta_declarada: ['',[Validators.required]],
     fechaPeriodo   : ['',[Validators.required]],
     id_estado      : [178,[Validators.required]], //Estado 178: ENVIADO
    })
  }

  crearOduplicarLiquidacion(){
    this.spinner.show();

    if (!this.DATA_DUPLICIDAD) {

      if (this.facturaForm.valid) {
        this.crearLiquidacion()
      } else {
        this.duplicarLiquidacion();
      }
    }
  }

  duplicarLiquidacion(){
    this.spinner.show();

    const formValues = this.facturaForm.getRawValue();
    let parametro: any = {
      queryId: 117,
      mapValue: {
        p_periodo           : this.utilService.generarPeriodo(formValues.fechaPeriodo),
        p_idProyecto        : formValues.id_proyecto,
        p_idLiquidacion     : formValues.id_liquidacion,
        p_subServicio       : formValues.subservicio,
        p_idGestor          : formValues.id_gestor,
        p_venta_declarada   : formValues.venta_declarada,
        p_idEstado          : formValues.id_estado,
        p_idUsuarioCrea     : this.userID,
        p_fechaCrea         : formValues.fecha_crea,
        p_ver_estado        : '',
        p_id_reg_proy       : '',
        CONFIG_USER_ID      : this.userID,
        CONFIG_OUT_MSG_ERROR: '',
        CONFIG_OUT_MSG_EXITO: '',
      }}

    this.facturacionService.duplicarLiquidacion(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Duplicar liquidación!',
        text : `La Liquidación, fue duplicado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  crearLiquidacion() {
    this.spinner.show();
    const formValues = this.facturaForm.getRawValue();

    let parametro: any =  {
        queryId: 117,
        mapValue:{
          p_periodo           : this.utilService.generarPeriodo(formValues.fechaPeriodo),
          p_idProyecto        : formValues.id_proyecto,
          p_idLiquidacion     : formValues.id_liquidacion,
          p_subServicio       : formValues.subservicio,
          p_idGestor          : formValues.id_gestor,
          p_venta_declarada   : formValues.venta_declarada,
          p_idEstado          : formValues.id_estado,
          p_idUsuarioCrea     : this.userID,
          p_fechaCrea         : formValues.fecha_crea,
          p_ver_estado        : '',
          p_id_reg_proy       : '',
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: '',
        }};
     console.log('VAOR', this.facturaForm.value , parametro);
     console.log('PERIODO_1', formValues.fechaPeriodo, this.utilService.generarPeriodo(formValues.fechaPeriodo)); // PERIODO_1 => 2022-07 / 2022-07-01
// return
    this.facturacionService.crearLiquidacion(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear liquidación!',
        text : `La Liquidación, fue creado con éxito`,
        // text : `La Liquidación: ${formValues.id_liquidacion},fue creado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  // moment.utc(formValues.fechaInicVac).format('YYYY-MM-DD'),
  // DATE_FORMAT(F.periodo, '%Y-%m') AS periodo,
  actionBtn: string = 'Crear';
  cargarDuplicidadByID(){
    if (this.DATA_DUPLICIDAD) {
      this.actionBtn = 'Duplicar'
        this.facturaForm.controls['id_proyecto'    ].setValue(this.DATA_DUPLICIDAD.id_proyecto)
        this.facturaForm.controls['id_liquidacion' ].setValue(this.DATA_DUPLICIDAD.id_liquidacion)
        this.facturaForm.controls['subservicio'    ].setValue(this.DATA_DUPLICIDAD.subServicio)
        this.facturaForm.controls['id_gestor'      ].setValue(this.DATA_DUPLICIDAD.id_gestor)
        this.facturaForm.controls['venta_declarada'].setValue(this.DATA_DUPLICIDAD.importe)
        this.facturaForm.controls['id_estado'      ].setValue(this.DATA_DUPLICIDAD.id_estado)
        this.facturaForm.controls['fechaPeriodo'   ].setValue(this.formatPeriodo(this.DATA_DUPLICIDAD.periodo))

        console.log('PER--DUP',this.DATA_DUPLICIDAD,  this.formatPeriodo(this.DATA_DUPLICIDAD.periodo) ); // 08-2022
    }
  };

  formatPeriodo(fechaPeriodo: string){
    const mesAndYear = fechaPeriodo.split('/');
    return mesAndYear[0] + '-' + mesAndYear[1]
  }

  getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.result.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

   listEstados: any[] = [];
   getListEstados(){
     let parametro: any[] = [{queryId: 101}];

     this.facturacionService.getListEstados(parametro[0]).subscribe((resp: any) => {
             this.listEstados = resp.list;
             console.log('EST-FACT', resp);
     });
   }

  listLiquidaciones: any[] = [];
  getListLiquidaciones(){
    let parametro: any[] = [{queryId: 82}];
    this.facturacionService.getListLiquidaciones(parametro[0]).subscribe((resp: any) => {
            this.listLiquidaciones = resp.list;
            // console.log('LIQUIDAC', resp);
    });
  }

  listGestores: any[] = [];
  getListGestores(){
    let arrayParametro: any[] = [{queryId: 102}];

    this.facturacionService.getListEstados(arrayParametro[0]).subscribe((resp: any) => {
            this.listGestores = resp.list;
            // console.log('GESTORES', resp);
    });
  };

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.facturacionService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp.list;
            // console.log('COD_PROY', resp.list);
    });
  };

  campoNoValido(campo: string): boolean {
    if (this.facturaForm.get(campo)?.invalid && this.facturaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
