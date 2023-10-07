import { DatePipe, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';
import { AgregarCertificacionComponent } from './agregar-certificacion/agregar-certificacion.component';
import { AgregarVentadeclaradaComponent } from './agregar-ventadeclarada/agregar-ventadeclarada.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-actualizar-liquidacion',
    templateUrl: './actualizar-liquidacion.component.html',
    styleUrls: ['./actualizar-liquidacion.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, NgFor, NgIf, MatTooltipModule, MatProgressSpinnerModule, DecimalPipe]
})
export class ActualizarLiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  userID: number = 0;
  facturaForm!: FormGroup;
  factura_Id = this.DATA_LIQUID.id_liq;

  constructor(
    private facturacionService: FacturacionService,
    private authService: AuthService,
    private fb: FormBuilder,
    private utilService: UtilService,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ActualizarLiquidacionComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_LIQUID: any,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListProyectos();
    this.getUserID();
    this.getListEstados();
    this.getListLiquidaciones();
    this.getListValidarProy();
    this.getListGestores();
    this.cargarFacturalById();
    this.getHistoricoCambiosEstado(this.DATA_LIQUID);
    this.cargarVentaDeclarada();
    this.cargarFactura();

    console.log('DATA_LIQUID', this.DATA_LIQUID);
    this.facturaForm.controls['id_factura'].setValue(this.DATA_LIQUID);
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

  newForm(){
    this.facturaForm = this.fb.group({
     id_liquidacion      : [''],
     codProy             : [''],
     subservicio         : [''],
     id_gestor           : [''],
     venta_declarada     : [''],
     fechaPeriodo        : [''],
     id_estado           : [''],
     orden_compra        : [''],
     certificacion       : [''],
     factura             : [''],
     monto_facturado     : [''],
     comentarios         : [''], // CAMBIAR POR OBS_REGULARIZACION
     gestor              : [''],
     fecha_crea          : [''],

     id_factura          : [''],
     user                : [''],
     id_regular_proy     : [''],
     comentarioLiq       : ['']
    })
   }

   actualizarLiquidacion() {
    this.spinner.show();
    let currentUser = this.authService.getUsername();

    const formValues = this.facturaForm.getRawValue();
    let parametro: any =  {
        queryId: 66,
        mapValue:{
          p_idFactura         : this.DATA_LIQUID.idFactura,
          p_periodo           : this.utilService.generarPeriodo(formValues.fechaPeriodo),
          p_idProyecto        : formValues.codProy,
          p_idLiquidacion     : formValues.id_liquidacion,
          p_subServicio       : formValues.subservicio,
          p_gestor            : formValues.gestor,
          p_idGestor          : formValues.id_gestor,
          p_venta_declarada   : formValues.venta_declarada,
          p_idEstado          : formValues.id_estado,
          p_orden_compra      : formValues.orden_compra,
          p_cod_certificacion : formValues.certificacion,
          p_factura           : formValues.factura,
          p_monto_facturado   : formValues.monto_facturado,
          p_id_reg_proy       : formValues.id_regular_proy,
          p_idMotivo          : '',
          p_idUsuarioCrea     : this.userID,
          p_fechaCrea         : this.datePipe.transform(formValues.fecha_crea, 'yyyy-MM-dd hh:mm:ss'),
          p_idUsuarioActualiza: this.userID,
          p_fechaActualiza    : '',
          p_obs_tipo_liq      : formValues.comentarioLiq,
          p_ver_estado        : 1,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: '',
        }};
    //  console.log('VAOR', formValues , parametro);
    this.facturacionService.actualizarLiquidacion(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Actualizar Liquidación!',
        text: `La Liquidación con ID: ${this.DATA_LIQUID.id_liq}, ha sido actualizado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });

      this.close(true);
    });
    this.spinner.hide();
  }

  setearTipoLiquidacion(): boolean{
    let esTipoRegularizacion = false;

    const tipoLiquidacion = this.listLiquidaciones.find(t => t.nombre.toUpperCase() == 'REGULARIZACIÓN');
    if (tipoLiquidacion ) {
      esTipoRegularizacion = tipoLiquidacion.id == this.facturaForm.controls['id_liquidacion'].value;
    }
    // console.log('TIPO_LIQ', tipoLiquidacion, esTipoRegularizacion);
    // console.log('ID_TIPO_LIQ',this.facturaForm.controls['id_liquidacion'].value );
    // console.log('ID_CORR_TIPO_LIQ', tipoLiquidacion.id );
    return esTipoRegularizacion;
   }

  estadoInicial: string = '';
  cargarFacturalById(){
    this.spinner.show();

    let parametro: any[] = [{
      queryId: 103,
      mapValue: {'param_id_factura': this.DATA_LIQUID.idFactura}
    }];

    this.facturacionService.cargarFacturaById(parametro[0]).subscribe( (resp: any) => {

      // console.log('LISTA-EDITAR_BY_ID', resp );
      for (let i = 0; i < resp.list.length; i++) {
        this.facturaForm.controls['id_liquidacion' ].setValue(resp.list[i].id_liquidacion);
        this.facturaForm.controls['codProy'        ].setValue(resp.list[i].id_proyecto);
        this.facturaForm.controls['subservicio'    ].setValue(resp.list[i].subServicio);
        this.facturaForm.controls['id_gestor'      ].setValue(resp.list[i].id_gestor);
        this.facturaForm.controls['venta_declarada'].setValue(resp.list[i].venta_declarada);
        this.facturaForm.controls['fechaPeriodo'   ].setValue(resp.list[i].periodo);
        this.facturaForm.controls['id_estado'      ].setValue(resp.list[i].id_estado);
        this.facturaForm.controls['orden_compra'   ].setValue(resp.list[i].orden_compra);
        this.facturaForm.controls['certificacion'  ].setValue(resp.list[i].cod_certificacion);
        this.facturaForm.controls['factura'        ].setValue(resp.list[i].factura);
        this.facturaForm.controls['monto_facturado'].setValue(resp.list[i].monto_facturado);
        this.facturaForm.controls['comentarioLiq'  ].setValue(resp.list[i].obs_tipo_liq);
        this.facturaForm.controls['gestor'         ].setValue(resp.list[i].gestor);
        this.facturaForm.controls['id_regular_proy'].setValue(resp.list[i].idRegularProy);

        // this.estadoInicial = resp.list[i].estado;

        if (resp.list[i].fechaCrea !='null' && resp.list[i].fechaCrea != '') {
          this.facturaForm.controls['fecha_crea'].setValue(resp.list[i].fechaCrea)
          }
      }
      this.spinner.hide();
    })
  }


  eliminarVentaDeclarada(id: any){
    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 120,
      "mapValue": { p_idFactVenta : id }
    }];

    Swal.fire({
      title: `Eliminar Venta declarada?`,
      text: `¿Desea eliminar la venta declarada: ${id}?`,
      icon: 'question',
      confirmButtonColor: '#20c997',
      cancelButtonColor : '#b2b5b4',
      confirmButtonText : 'Si!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {

    this.facturacionService.eliminarVentaDeclarada(parametro[0]).subscribe(resp => {
      if (resp) {
        Swal.fire({
          title: 'Eliminar Venta declarada',
          text: `La venta declarada: ${id}, fue eliminado con éxito`,
          icon: 'success',
        });
      this.cargarVentaDeclarada()
        }
      });
    });
    this.spinner.hide();
  }

  eliminaFactura(id: any){
    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 119,
      "mapValue": { p_idFactCertificacion : id }
    }];

    Swal.fire({
      title: `Eliminar Factura?`,
      text: `¿Desea eliminar la factura: ${id}?`,
      icon: 'question',
      confirmButtonColor: '#20c997',
      cancelButtonColor : '#b2b5b4',
      confirmButtonText : 'Si!',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((resp) => {

        if (resp.value) {
          this.facturacionService.eliminaFactura(parametro[0]).subscribe(resp => {
           if (resp) {
            this.cargarFactura()
            Swal.fire({
              title: 'Eliminar Factura',
              text: `La factura: ${id}, fue eliminado con éxito`,
              icon: 'success',
            });
           }
          });
        }
      });
    this.spinner.hide();
  }

  histCambiosEstado: any[] = [];
  getHistoricoCambiosEstado(id: number){
  this.spinner.show();
    let parametro: any[] = [{
      queryId: 67,
      mapValue: {p_id: this.DATA_LIQUID.idFactura}
    }];

    this.facturacionService.getHistoricoCambiosEstado(parametro[0]).subscribe((resp: any) => {
      this.histCambiosEstado = resp.list;
      console.log('HistCambIDFact', resp.list)
    });
    this.spinner.hide();
  }

  getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.result.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

  listLiquidaciones: any[] = [];
  getListLiquidaciones(){
    let parametro: any[] = [{queryId: 82}];
    this.facturacionService.getListLiquidaciones(parametro[0]).subscribe((resp: any) => {
            this.listLiquidaciones = resp.list;
            console.log('LIQUIDAC', resp);
    });
  }

  listValidarProy: any[] = [];
  getListValidarProy(){
    let parametro: any[] = [{queryId: 152}];
    this.facturacionService.getListValidarProy(parametro[0]).subscribe((resp: any) => {
            this.listValidarProy = resp.list;
            // console.log('LIQUIDAC', resp);
    });
  }

  listEstados: any[] = [];
  getListEstados(){
    let parametro: any[] = [{queryId: 101}];

    this.facturacionService.getListEstados(parametro[0]).subscribe((resp: any) => {
            this.listEstados = resp.list;
            // console.log('EST-FACT', resp);
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
            // console.log('COD_PROY', resp);
    });
  };

  listVentaDeclarada: any[] = [];
  cargarVentaDeclarada(){
    this.blockUI.start("Cargando lista...");
    let parametro: any[] = [{
      "queryId": 112,
      "mapValue": { p_id : this.DATA_LIQUID.idFactura }
    }];
    this.facturacionService.cargarVentaDeclarada( parametro[0]).subscribe( (resp: any) => {
      this.blockUI.stop();

      // console.log('List-VD', resp.list);
      this.listVentaDeclarada = resp.list;

      this.spinner.hide();
    })
  }

  listFactura: any[] = [];
  cargarFactura(){
    this.blockUI.start("Cargando lista...");
    let parametro: any[] = [{
      "queryId": 71,
      "mapValue": { p_id : this.DATA_LIQUID.idFactura }
    }];
    this.facturacionService.cargarFactura( parametro[0]).subscribe( (resp: any) => {
      this.blockUI.stop();

      // console.log('List-F', resp.list);
      this.listFactura = resp.list;

      this.spinner.hide();
    })
  }

  importTotal: number = 0;
  obtenerImporteTotal(): number{
    this.importTotal = 0;

    this.listFactura.map(factura => {
      this.importTotal = this.importTotal + factura.importe
      })

    return this.importTotal;
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  agregarVentaDeclarada(){
    // console.log('DA-LIQ', DATA);
    const dialogRef = this.dialog.open(AgregarVentadeclaradaComponent, { width:'25%', data: {vdForm: this.facturaForm.value, isCreation: true}});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarVentaDeclarada()
      }
    })
  }

  actualizarVentaDeclarada(DATA: any){
    // console.log('DATA_VD', DATA);
    const dialogRef = this.dialog.open(AgregarVentadeclaradaComponent, { width:'25%', data: DATA });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarVentaDeclarada()
      }
    })
  }

  agregarFactura(){
    const dialogRef = this.dialog.open(AgregarCertificacionComponent, { width:'35%', data: {fForm: this.facturaForm.value, isCreation: true}});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarFactura()
      }
    })
  }

  actualizarFactura(DATA: any){
    // console.log('DATA_F', DATA);
    // const DATA = this.facturaForm.value
    const dialogRef = this.dialog.open(AgregarCertificacionComponent, { width:'35%', data: DATA});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.cargarFactura()
      }
    })
  };

}
