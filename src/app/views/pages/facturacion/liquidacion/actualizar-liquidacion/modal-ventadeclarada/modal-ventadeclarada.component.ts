import { DatePipe, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import * as moment from 'moment';

@Component({
    selector: 'app-modal-ventadeclarada',
    templateUrl: './modal-ventadeclarada.component.html',
    styleUrls: ['./modal-ventadeclarada.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, NgIf]
})
export class ModalVentadeclaradaComponent implements OnInit {

  constructor(
    private facturacionService: FacturacionService,
    private liquidacionService: LiquidacionService,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<ModalVentadeclaradaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_VD: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();

    if (this.DATA_VD) {
      this.cargarVentaDeclaradaByID(this.DATA_VD.idFactura);
      console.log('DATA_MODAL_VD', this.DATA_VD, this.DATA_VD.idVentaDeclarada);
    }
  }

  ventaDeclaradaForm!: FormGroup;
  newForm(){
    this.ventaDeclaradaForm = this.fb.group({
     idCertifacion  : [''],
     ventaDeclarada : ['', [Validators.required]],
     periodo        : ['', [Validators.required]],
     comentario     : ['-',[Validators.required]],
     fechaCrea      : ['']
    })
   }

  crearOactualizarVentaDeclarada(){
    if (this.ventaDeclaradaForm.invalid) {
      return Object.values(this.ventaDeclaradaForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }
    const idVd = this.ventaDeclaradaForm.get('idCertifacion')?.value;

    if (idVd > 0) {
      if (this.ventaDeclaradaForm.valid) {
        console.log('ACT_VD');
        this.actualizarVentaDeclarada();
      }
    } else {
      console.log('CREAR_VD');
      this.crearVentaDeclarada()
    }
   }

  crearVentaDeclarada(): void{
    // const request = {...this.ventaDeclaradaForm.value};
    // request.periodo = request.periodo + '-' + '01';

    const formValues = this.ventaDeclaradaForm.getRawValue();
    const request = {
      idFactura      : this.DATA_VD.vdForm.idFactura,
      periodo        : formValues.periodo + '-' + '01',
      venta_declarada: formValues.ventaDeclarada,
      comentario     : formValues.comentario,
      usuario        : this.userID
    }

    this.liquidacionService.crearVentaDeclarada(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear venta declarada!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.close(true);
      }
    })
  }

  actualizarVentaDeclarada() {
    this.spinner.show();

    const formValues = this.ventaDeclaradaForm.getRawValue();
    let parametro: any[] = [{ queryId: 110,
        mapValue: {
          p_idFactVenta       : this.DATA_VD.idFactVenta,
          p_idFactura         : this.DATA_VD.idFactura,
          p_periodo           : this.utilService.generarPeriodo(formValues.periodo) ,
          p_venta_declarada   : formValues.ventaDeclarada ,
          p_comentario        : formValues.comentario ,
          p_dFecha            : formValues.fechaCrea,
          p_usuario           : this.userID ,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: "",
          CONFIG_OUT_MSG_EXITO: "",
        },
      }];
     this.facturacionService.actualizarVentaDeclarada(parametro[0]).subscribe({next: (res) => {
        this.spinner.hide();

        this.close(true)
          Swal.fire({
            title: 'Actualizar venta declarada!',
            text : `La Venta declarada, se actualizó con éxito`,
            icon : 'success',
            confirmButtonText: 'Ok'
            });

          this.ventaDeclaradaForm.reset();
          this.dialogRef.close('Actualizar');
        }, error:()=>{
          Swal.fire(
            'ERROR',
            'No se pudo actualizar la venta declarada',
            'warning'
          );
        }
     });
  }

  actionBtn: string = 'Crear';
  cargarVentaDeclaradaByID(idVD?: any){
    if (!this.DATA_VD.isCreation) {

      this.actionBtn = 'Actualizar'
      this.liquidacionService.getVentaDeclaradaById(this.DATA_VD.idVentaDeclarada).subscribe((resp: any) => {
        console.log('CARGA_ID_VD', resp);

        this.ventaDeclaradaForm.reset({
          ventaDeclarada: resp.venta_declarada,
          periodo       : moment.utc(resp.periodo).format('YYYY-MM'),
          comentario    : resp.comentario,
          fechaCrea     : resp.fechaCrea,
        })
      })
    }
  }

  formatPeriodo(fechaPeriodo: string){
    const mesAndYear = fechaPeriodo.split('/');

    return mesAndYear[1] + '-' + mesAndYear[0]
  }

   userID: number = 0;
   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.result.user.userId;
    })
   }

  campoNoValido(campo: string): boolean {
    if (this.ventaDeclaradaForm.get(campo)?.invalid && this.ventaDeclaradaForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
