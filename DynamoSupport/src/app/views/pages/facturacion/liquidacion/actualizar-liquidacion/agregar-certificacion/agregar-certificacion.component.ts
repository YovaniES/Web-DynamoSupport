import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-certificacion',
  templateUrl: './agregar-certificacion.component.html',
  styleUrls: ['./agregar-certificacion.component.scss']
})
export class AgregarCertificacionComponent implements OnInit {
  facturaForm!: FormGroup;

  constructor(
    private facturacionService: FacturacionService,
    private authService: AuthService,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<AgregarCertificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_LIQUID: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.getListEstadosFacturacion();
    this.cargarFacturaByID();
    console.log('DATA_LIQUID_F', this.DATA_LIQUID);
    console.log('DATA_LIQUID_F_ID', this.DATA_LIQUID.idFactCertificacion);
  }

  newForm(){
    this.facturaForm = this.fb.group({
     ordenCompra   : ['',[Validators.required]],
     importe       : ['',[Validators.required]],
     certificacion : ['',[Validators.required]],
     estFactura    : [182,[Validators.required]],
    //  estFactura    : [ 6,[Validators.required]],
     factura       : ['',[Validators.required]],
     fechaFact     : ['',[Validators.required]],
     comentario    : ['']
    })
   }

  agregarOactualizarCertificacion(){
    if (!this.DATA_LIQUID) {
      return
    }

    this.spinner.show();
    if (this.DATA_LIQUID.isCreation) {
      if (this.facturaForm.valid) { this.agregarCertificacion() }
    } else {
      this.actualizarCertificacion();
    }
  }

  agregarCertificacion() {
    const formValues = this.facturaForm.getRawValue();

    let parametro: any =  {
        queryId: 111,
        mapValue: {
          p_idFactura         : this.DATA_LIQUID.fForm.id_factura.idFactura,
          p_fecha_facturacion : formValues.fechaFact,
          p_importe           : formValues.importe,
          p_oc                : formValues.ordenCompra,
          p_certificacion     : formValues.certificacion,
          p_idEstado          : formValues.estFactura,
          p_factura           : formValues.factura,
          p_fechacreacion     : '',
          p_comentario        : formValues.comentario,
          p_usuario           : this.userID,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: '',
        },
      };
     console.log('VAOR_CERTIF', this.facturaForm.value , parametro);
    this.facturacionService.agregarCertificacion(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Agregar Factura!',
        text: `La Factura: ${formValues.factura}, fue agregado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });

      this.close(true);
    });
  }

  actualizarCertificacion(){
    this.spinner.show();

    const formValues = this.facturaForm.getRawValue();
    let parametro: any[] = [{ queryId: 114,
        mapValue: {
          p_idFactCertificacion   : this.DATA_LIQUID.idFactCertificacion,
          p_idFactura             : this.DATA_LIQUID.idFactura,
          p_fecha_facturacion     : this.datePipe.transform(formValues.fechaFact, 'yyyy-MM-dd hh:mm:ss'),
          // p_fecha_facturacion     : formValues.fechaFact,
          p_importe               : formValues.importe,
          p_oc                    : formValues.ordenCompra,
          p_certificacion         : formValues.certificacion,
          p_idEstado              : formValues.estFactura,
          p_factura               : formValues.factura,
          p_dFecha                : this.DATA_LIQUID.dFecha,
          p_comentario            : formValues.comentario,
          p_usuario               : this.userID,
          CONFIG_USER_ID          : this.userID,
          CONFIG_OUT_MSG_ERROR    : '',
          CONFIG_OUT_MSG_EXITO    : ''
        },
      }];
    this.facturacionService.actualizarCertificacion(parametro[0]).subscribe({next: (res) => {
        this.spinner.hide();

        this.close(true)
          Swal.fire({
            title: 'Actualizar Factura!',
            text : `La Factura: ${formValues.factura}, se actualizó con éxito`,
            icon : 'success',
            confirmButtonText: 'Ok'
            });

          this.facturaForm.reset();
          this.dialogRef.close('Actualizar');
        }, error:()=>{
          Swal.fire(
            'ERROR',
            'No se pudo actualizar la Factura',
            'warning'
          );
        }
     });
  }

  actionBtn: string = 'Agregar'
  cargarFacturaByID(){
    if (!this.DATA_LIQUID.isCreation) {
    this.actionBtn = 'Actualizar'
      this.facturaForm.controls['ordenCompra'  ].setValue(this.DATA_LIQUID.oc);
      this.facturaForm.controls['importe'      ].setValue(this.DATA_LIQUID.importe);
      this.facturaForm.controls['certificacion'].setValue(this.DATA_LIQUID.certificacion);
      this.facturaForm.controls['estFactura'   ].setValue(this.DATA_LIQUID.id_estado);
      this.facturaForm.controls['factura'      ].setValue(this.DATA_LIQUID.factura);
      this.facturaForm.controls['comentario'   ].setValue(this.DATA_LIQUID.comentario);

      // if (this.DATA_LIQUID.fecha_facturacion !='null' && this.DATA_LIQUID.fecha_facturacion != '') {
      //   this.facturaForm.controls['fechaFact'].setValue(this.DATA_LIQUID.fecha_facturacion)
      // }

      if (this.DATA_LIQUID.fecha_facturacion !='null' && this.DATA_LIQUID.fecha_facturacion != '') {
        let fechaF = this.DATA_LIQUID.fecha_facturacion
        const str   = fechaF.split('/');
        const year  = Number(str[2]);
        const month = Number(str[1]);
        const date  = Number(str[0]);
        this.facturaForm.controls['fechaFact'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
      }
    }
  }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     console.log('ID-USER', this.userID);
   })
  }

  listEstadosFacturacion: any[] = [];
  getListEstadosFacturacion(){
    let parametro: any[] = [{queryId: 106}];

    this.facturacionService.getListEstadosFacturacion(parametro[0]).subscribe((resp: any) => {
            this.listEstadosFacturacion = resp.list;
            console.log('EST-FACTX', resp);
    });
  }

  campoNoValido(campo: string): boolean {
    if (this.facturaForm.get(campo)?.invalid && this.facturaForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
