import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { UtilService } from 'src/app/core/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-ventadeclarada',
  templateUrl: './agregar-ventadeclarada.component.html',
  styleUrls: ['./agregar-ventadeclarada.component.scss']
})
export class AgregarVentadeclaradaComponent implements OnInit {
  ventaDeclaradaForm!: FormGroup;

  constructor(
    private facturacionService: FacturacionService,
    private utilService: UtilService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<AgregarVentadeclaradaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_LIQUID: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.cargarVentaDeclaradaByID();
    console.log('DATA_LIQUID_VD', this.DATA_LIQUID, this.DATA_LIQUID.vdForm);
    // console.log('VENTA_DECL_VD', this.DATA_LIQUID.vdForm.venta_declarada);
    // console.log('VD',this.cargarVentaDeclarada());
  }

  newForm(){
    this.ventaDeclaradaForm = this.fb.group({
    //  ventaDeclarada : [this.DATA_LIQUID.vdForm.venta_declarada, [Validators.required]],
     ventaDeclarada : ['', [Validators.required]],
     periodo        : ['', [Validators.required]],
     comentario     : ['-',[Validators.required]],
     fechaCrea      : ['']
    })
   }

   agregarOactualizarVentaDeclarada(){
    if (!this.DATA_LIQUID) {
    return
      }

    if (this.DATA_LIQUID.isCreation) {
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
          p_idFactura       : this.DATA_LIQUID.vdForm.id_factura.idFactura,
          p_periodo         : this.utilService.generarPeriodo(formValues.periodo),
          p_venta_declarada : formValues.ventaDeclarada, //this.DATA_LIQUID.vdForm.venta_declarada, //formValues.ventaDeclarada,
          p_comentario      : formValues.comentario,
          p_fecha_creacion  : '',
          p_usuario_creacion: this.userID,
          CONFIG_USER_ID    : this.userID,
          // CONFIG_OUT_MSG_ERROR    : "",
          // CONFIG_OUT_MSG_EXITO    : "",
        },
      };
     console.log('VAOR_VD', this.ventaDeclaradaForm.value , parametro, this.DATA_LIQUID.vdForm.id_factura.idFactura);
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
          p_idFactVenta        : this.DATA_LIQUID.idFactVenta,
          p_idFactura          : this.DATA_LIQUID.idFactura,
          p_periodo            : this.utilService.generarPeriodo(formValues.periodo) ,
          p_venta_declarada    : formValues.ventaDeclarada ,
          p_comentario         : formValues.comentario ,
          p_dFecha             : formValues.fechaCrea,
          p_usuario            : this.userID ,
          CONFIG_USER_ID       : this.userID,
          CONFIG_OUT_MSG_ERROR : "",
          CONFIG_OUT_MSG_EXITO : "",
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

  titleBtn: string = 'Agregar';
  cargarVentaDeclaradaByID(){
    if (!this.DATA_LIQUID.isCreation) {
      this.titleBtn = 'Actualizar'
      this.ventaDeclaradaForm.controls['ventaDeclarada'].setValue(this.DATA_LIQUID.venta_declarada);
      this.ventaDeclaradaForm.controls['periodo'       ].setValue(this.formatPeriodo(this.DATA_LIQUID.periodo));
      this.ventaDeclaradaForm.controls['comentario'    ].setValue(this.DATA_LIQUID.comentario);

      if (this.DATA_LIQUID.dFecha !='null' && this.DATA_LIQUID.dFecha != '') {
        this.ventaDeclaradaForm.controls['fechaCrea'].setValue(this.DATA_LIQUID.dFecha)
        }
      console.log('VD_PER', this.formatPeriodo(this.DATA_LIQUID.periodo)); // 2022-09

    }
  }

  formatPeriodo(fechaPeriodo: string){
    const mesAndYear = fechaPeriodo.split('/');

    return mesAndYear[1] + '-' + mesAndYear[0]
  }

   userID: number = 0;
   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
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
