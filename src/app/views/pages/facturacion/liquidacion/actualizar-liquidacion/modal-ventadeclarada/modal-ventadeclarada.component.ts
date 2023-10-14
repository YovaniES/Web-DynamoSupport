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
  ventaDeclaradaForm!: FormGroup;

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
      this.cargarVentaDeclaradaByID(this.DATA_VD.idVentaDeclarada);
      console.log('DATA_MODAL_VD', this.DATA_VD, this.DATA_VD.idVentaDeclarada);
    }
  }

  newForm(){
    this.ventaDeclaradaForm = this.fb.group({
    //  ventaDeclarada : [this.DATA_VD.vdForm.venta_declarada, [Validators.required]],
     ventaDeclarada : ['', [Validators.required]],
     periodo        : ['', [Validators.required]],
     comentario     : ['-',[Validators.required]],
     fechaCrea      : ['']
    })
   }

   agregarOactualizarVentaDeclarada(){
    if (!this.DATA_VD) {
    return
      }

    if (this.DATA_VD) {
      if (this.ventaDeclaradaForm.valid) { this.agregarVentaDeclarada()}
    } else {
      this.actualizarVentaDeclarada();
    }
   }

   agregarVentaDeclarada() {
    this.spinner.show();
    const formValues = this.ventaDeclaradaForm.getRawValue();

    let parametro: any =  {
        queryId: 105,
        mapValue: {
          p_idFactura       : this.DATA_VD.vdForm.id_factura.idFactura,
          p_periodo         : this.utilService.generarPeriodo(formValues.periodo),
          p_venta_declarada : formValues.ventaDeclarada, //this.DATA_VD.vdForm.venta_declarada, //formValues.ventaDeclarada,
          p_comentario      : formValues.comentario,
          p_fecha_creacion  : '',
          p_usuario_creacion: this.userID,
          CONFIG_USER_ID    : this.userID,
          // CONFIG_OUT_MSG_ERROR    : "",
          // CONFIG_OUT_MSG_EXITO    : "",
        },
      };
     console.log('VAOR_VD', this.ventaDeclaradaForm.value , parametro, this.DATA_VD.vdForm.id_factura.idFactura);
    this.facturacionService.agregarVentaDeclarada(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Agregar Venta Declarada!',
        text : `La venta declarada, fue creado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
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

  // cargarVentaDeclaradaByID_xxxx(){
  //   if (!this.DATA_VD.isCreation) {
  //     this.titleBtn = 'Actualizar'
  //     this.ventaDeclaradaForm.controls['ventaDeclarada'].setValue(this.DATA_VD.venta_declarada);
  //     this.ventaDeclaradaForm.controls['periodo'       ].setValue(this.formatPeriodo(this.DATA_VD.periodo));
  //     this.ventaDeclaradaForm.controls['comentario'    ].setValue(this.DATA_VD.comentario);

  //     if (this.DATA_VD.dFecha !='null' && this.DATA_VD.dFecha != '') {
  //       this.ventaDeclaradaForm.controls['fechaCrea'].setValue(this.DATA_VD.dFecha)
  //       }
  //     console.log('VD_PER', this.formatPeriodo(this.DATA_VD.periodo)); // 2022-09

  //   }
  // }

  actionBtn: string = 'Agregar';
  cargarVentaDeclaradaByID(idVD?: any){
    if (this.DATA_VD) {
      console.log('VD***', this.DATA_VD[0].idVentaDeclarada);
      console.log('XYZ', this.DATA_VD);

      this.actionBtn = 'Actualizar'
      this.liquidacionService.getVentaDeclaradaById(this.DATA_VD[0].idVentaDeclarada).subscribe((resp: any) => {
        // for (let i = 0; i < resp.result.length; i++) { }

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
      // console.log('ID-USER', this.userID);
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
