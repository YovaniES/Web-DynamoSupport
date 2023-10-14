import { DatePipe, NgIf, NgFor, DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MantenimientoService } from 'src/app/core/services/mantenimiento.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalCertificacionComponent } from '../actualizar-liquidacion/modal-certificacion/modal-certificacion.component';
import { ModalVentadeclaradaComponent } from '../actualizar-liquidacion/modal-ventadeclarada/modal-ventadeclarada.component';

@Component({
    selector: 'app-modal-liquidacion',
    templateUrl: './modal-liquidacion.component.html',
    styleUrls: ['./modal-liquidacion.component.scss'],
    standalone: true,
    imports: [NgIf,
      MatIconModule,
      FormsModule,
      ReactiveFormsModule,
      NgFor,
      MatProgressSpinnerModule,
      DecimalPipe,
      DatePipe]
})
export class ModalLiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  liquidacion_Id: number = 0;

  loadingItem: boolean = false;
  userID: number = 0;

  constructor(
    private liquidacionService  : LiquidacionService,
    private mantenimientoService: MantenimientoService,
    private authService         : AuthService,
    private fb                  : FormBuilder,
    public datePipe             : DatePipe,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public DATA_LIQUID: any
  ){}

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.getListEstados();
    this.getListGestores();
    this.getListProyectos();

    if (this.DATA_LIQUID) {
      this.liquidacion_Id = this.DATA_LIQUID.idFactura;
      this.cargarLiqById(this.DATA_LIQUID.idFactura);

      // console.log('DATA_MODAL_LIQUID', this.DATA_LIQUID);
      this.getListVentaDeclarada();
      this.getListCertificacion();
      this.getListHistoricoCambios()
    }
  }

  liquidacionForm!: FormGroup;
  newForm(){
    this.liquidacionForm = this.fb.group({
     idFactura      : [''],
     periodo        : ['', [Validators.required]],
     proyecto       : ['', [Validators.required]],
     idLiquidacion  : ['',], //acta,
     subServicio    : ['', [Validators.required]],
     idGestor       : ['', [Validators.required]],
     importe        : ['', [Validators.required]],
     idEstado       : [178],
     idUsuarioCrea  : ['' ],
     fecha_crea     : ['' ],
     ver_estado     : ['' ],
    })
  }


  // crearOduplicarLiquidacion(){
  //   this.spinner.show();

  //   if (!this.DATA_DUPLICIDAD) {

  //     if (this.liquidacionForm.valid) {
  //       this.crearLiquidacion()
  //     } else {
  //       this.duplicarLiquidacion();
  //     }
  //   }
  // }

  crearOactualizarLiq(){
    if (this.liquidacionForm.invalid) {
      return Object.values(this.liquidacionForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    const idFact = this.liquidacionForm.get('idFactura')?.value;

    if (idFact > 0) {
      console.log('A C T',);
      this.actualizarLiquidacion(idFact);
    }else {
      console.log('C R E A R');
      this.crearLiquidacion();
    }
  }

  crearLiquidacion(): void{
    const request =  {...this.liquidacionForm.value}

    const fechaActual = new Date();
    request.periodo = request.periodo + '-'+ '01'
    // request.periodo = request.periodo + '-'+ fechaActual.getDay()

    this.liquidacionService.createLiquidacion(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear liquidación!',
          text : `${resp.message}`,
          // text : `La Liquidación: ${formValues.id_liquidacion},fue creado con éxito`,
          icon : 'success',
          confirmButtonText: 'Ok',
        });
        // this.close(true);
      }
    })
  }

  actualizarLiquidacion(id: number){

  }

  // periodo:"2023-01-01T00:00:00"
  actionBtn: string = 'Crear';
  cargarLiqById(idLiq: number): void{
    // this.blockUI.start("Cargando data...");

    if (this.DATA_LIQUID) {
      this.actionBtn = 'Actualizar'
      this.liquidacionService.getLiquidacionById(idLiq).subscribe((resp: any) => {
        this.liquidacionForm.reset({
          idFactura      : resp.idFactura,
          periodo        : resp.periodo,
          // proyecto       : resp.proyecto,
          // idLiquidacion  : resp.idLiquidacion,
          subServicio    : resp.subServicio,
          idGestor       : resp.gestor,
          importe        : resp.importe,
          idEstado       : resp.estado,
          fecha_crea     : resp.fechaCrea,
          // idUsuarioCrea  : resp.idUsuarioCrea,
          // ver_estado     : resp.ver_estado,
        })
      })
    }
  }

  formatPeriodo(fechaPeriodo: string){
    const mesAndYear = fechaPeriodo.split('/');
    return mesAndYear[0] + '-' + mesAndYear[1]
  }

  listVentaDeclarada:any[] = [];
  getListVentaDeclarada(){
    this.blockUI.start('Cargando lista venta declarada...');
    // console.log('ID_LIQ_VD', this.DATA_LIQUID.idFactura);
    const requestId = {
      idFactura : this.DATA_LIQUID.idFactura
    }

    this.liquidacionService.getAllVentaDeclarada(requestId).subscribe((resp: any) => {
      // console.log('DATA_VD', resp, resp.result);
      this.blockUI.stop();

      this.listVentaDeclarada = [];
      this.listVentaDeclarada = resp.result;
    })
  }

  listCertificacion:any[] = [];
  getListCertificacion(){
    // console.log('ID_LIQ_VD', this.DATA_LIQUID.idFactura);
    const requestId = {
      idFactura : this.DATA_LIQUID.idFactura
    }


    this.liquidacionService.getListCertificacion(requestId).subscribe((resp: any) => {
      console.log('DATA_CERT', resp);

      this.listCertificacion = [];
      this.listCertificacion = resp.result;
    })
  }

  eliminaVentaDeclarada(idVd: number){}
  eliminarCertificacion(idCert: number){}

  importTotal: number = 0;
  obtenerImporteTotal(): number{
    this.importTotal = 0;

    this.listVentaDeclarada.map(factura => {
      this.importTotal = this.importTotal + factura.importe
      })

    return this.importTotal;
  }

  histCambiosEstado: any[] = [];
  getListHistoricoCambios(){
    this.liquidacionService.getHistLiquidacion(this.DATA_LIQUID.idFactura).subscribe((resp: any) => {
      // console.log('HIST', resp);
      this.histCambiosEstado = resp.result;
    })
  }



  getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.result.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

   listEstados: any[] = [];
   getListEstados(){
     this.mantenimientoService.getAllEstados().subscribe((resp: any) => {
       this.listEstados = resp.result;
     })
   }

  listGestores: any[] = [];
  getListGestores(){
    this.mantenimientoService.getAllGestores().subscribe((resp: any) => {
      this.listGestores = resp.result;
    })
  }

  listProyectos: any[] = [];
  getListProyectos(){
    this.mantenimientoService.getAllProyectos().subscribe((resp: any) => {
      this.listProyectos = resp.result;
      // console.log('LIQ_PROY', this.listProyectos);
    })
  }


  modalCrearVentaDeclarada(DATA_VD?: any){
    const dialogRef = this.dialog.open(ModalVentadeclaradaComponent, { width:'35%' });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        // this.cargarFactura()
      }
    })
  }

  modalActualizarVentaDeclarada(DATA_VD?: any){
    const dialogRef = this.dialog.open(ModalVentadeclaradaComponent, { width:'35%', data: this.listVentaDeclarada});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        // this.cargarFactura()
      }
    })
  }

  abrirActualizarModalCertificacion(DATA?: any){
    this.dialog.open(ModalCertificacionComponent, { width:'35%', data: this.listCertificacion}).afterClosed().subscribe(resp => {
      if (resp) {
        // this.cargarFactura()
      }
    })
  };

  abrirCrearModalCertificacion(){
    this.dialog.open(ModalCertificacionComponent, { width:'35%',}).afterClosed().subscribe(resp => {
      if (resp) {
        // this.cargarFactura()
      }
    })
  };

  campoNoValido(campo: string): boolean {
    if (this.liquidacionForm.get(campo)?.invalid && this.liquidacionForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    // this.dialog.close(succes);
  }
}

