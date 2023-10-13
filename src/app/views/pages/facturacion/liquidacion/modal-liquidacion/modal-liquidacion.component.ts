import { DatePipe, NgIf, NgFor, DecimalPipe } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { MantenimientoService } from 'src/app/core/services/mantenimiento.service';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgregarCertificacionComponent } from '../actualizar-liquidacion/agregar-certificacion/agregar-certificacion.component';
import { AgregarVentadeclaradaComponent } from '../actualizar-liquidacion/agregar-ventadeclarada/agregar-ventadeclarada.component';

@Component({
    selector: 'app-modal-liquidacion',
    templateUrl: './modal-liquidacion.component.html',
    styleUrls: ['./modal-liquidacion.component.scss'],
    standalone: true,
    imports: [NgIf, MatIconModule, FormsModule, ReactiveFormsModule, NgFor, MatProgressSpinnerModule, DecimalPipe]
})
export class ModalLiquidacionComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  factura_Id: number = 0;

  loadingItem: boolean = false;

  userID: number = 0;
  liquidacionForm!: FormGroup;

  constructor(
    private liquidacionService  : LiquidacionService,
    private mantenimientoService: MantenimientoService,
    private authService         : AuthService,
    private fb                  : FormBuilder,
    public datePipe             : DatePipe,
    // private dialog              : MatDialogRef<AgregarCertificacionComponent>,
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
      this.factura_Id = this.DATA_LIQUID.idFactura;
      this.cargarLiqById(this.DATA_LIQUID.idFactura);

      console.log('DATA_MODAL_LIQUID', this.DATA_LIQUID);
    }
  }

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
    //  id_reg_proy    : [1,  [Validators.required]],
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
          // periodo        : DATE_FORMAT(resp.periodo, '%Y-%m') ,
          proyecto       : resp.proyecto,
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

    // moment.utc(formValues.fechaInicVac).format('YYYY-MM-DD'),
    // DATE_FORMAT(F.periodo, '%Y-%m') AS periodo,


  formatPeriodo(fechaPeriodo: string){
    const mesAndYear = fechaPeriodo.split('/');
    return mesAndYear[0] + '-' + mesAndYear[1]
  }

  listVentaDeclarada:any[] = [];
  eliminaVentaDeclarada(idVd: number){

  }

  importTotal: number = 0;
  obtenerImporteTotal(): number{
    this.importTotal = 0;

    this.listVentaDeclarada.map(factura => {
      this.importTotal = this.importTotal + factura.importe
      })

    return this.importTotal;
  }

  histCambiosEstado: any[] = [];



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

  abrirAgregaOactualizarVentaDeclarada(DATA_VD?: any){
    const dialogRef = this.dialog.open(AgregarVentadeclaradaComponent, { width:'35%', data: {fForm: this.liquidacionForm.value, isCreation: true}});

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        // this.cargarFactura()
      }
    })
  }

  abrirAgregarOactualizarCertificacion(DATA?: any){
    console.log('DATA_F', DATA);
    // const DATA = this.facturaForm.value
    this.dialog.open(AgregarCertificacionComponent, { width:'35%', data: {fForm: this.liquidacionForm.value, isCreation: true}}).afterClosed().subscribe(resp => {
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
