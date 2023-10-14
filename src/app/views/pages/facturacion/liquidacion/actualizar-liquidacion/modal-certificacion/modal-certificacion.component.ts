import { DatePipe, NgIf, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { LiquidacionService } from 'src/app/core/services/liquidacion.service';
import * as moment from 'moment';
import { MantenimientoService } from 'src/app/core/services/mantenimiento.service';

@Component({
    selector: 'app-modal-certificacion',
    templateUrl: './modal-certificacion.component.html',
    styleUrls: ['./modal-certificacion.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, NgIf, NgFor]
})
export class ModalCertificacionComponent implements OnInit {

  constructor(
    private facturacionService: FacturacionService,
    private liquidacionService: LiquidacionService,
    private mantenimientoService: MantenimientoService,
    private authService: AuthService,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ModalCertificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_CERT: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getUserID();
    this.getListEstadosCert();

    if (this.DATA_CERT) {
      this.cargarVentaDeclaradaByID()
      console.log('DATA_CERT', this.DATA_CERT);
      console.log('DATA_CERT_ID', this.DATA_CERT.idCertificacion);
    }
  }

  certifForm!: FormGroup;
  newForm(){
    this.certifForm = this.fb.group({
     ordenCompra   : ['',[Validators.required]],
     importe       : ['',[Validators.required]],
     certificacion : ['',[Validators.required]],
     estFactura    : ['Certificado',[Validators.required]],
     factura       : ['',[Validators.required]],
     fechaFact     : ['',[Validators.required]],
     comentario    : ['']
    })
   }

  agregarOactualizarCertificacion(){
    if (!this.DATA_CERT) {
      return
    }

    this.spinner.show();
    if (this.DATA_CERT) {
      if (this.certifForm.valid) { this.agregarCertificacion() }
    } else {
      this.actualizarCertificacion();
    }
  }

  agregarCertificacion() {
    const formValues = this.certifForm.getRawValue();

    let parametro: any =  {
        queryId: 111,
        mapValue: {
          p_idFactura         : this.DATA_CERT.fForm.id_factura.idFactura,
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
     console.log('VAOR_CERTIF', this.certifForm.value , parametro);
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

    const formValues = this.certifForm.getRawValue();
    let parametro: any[] = [{ queryId: 114,
        mapValue: {
          p_idFactCertificacion : this.DATA_CERT.idFactCertificacion,
          p_idFactura           : this.DATA_CERT.idFactura,
          p_fecha_facturacion   : this.datePipe.transform(formValues.fechaFact, 'yyyy-MM-dd hh:mm:ss'),
          // p_fecha_facturacion   : formValues.fechaFact,
          p_importe             : formValues.importe,
          p_oc                  : formValues.ordenCompra,
          p_certificacion       : formValues.certificacion,
          p_idEstado            : formValues.estFactura,
          p_factura             : formValues.factura,
          p_dFecha              : this.DATA_CERT.dFecha,
          p_comentario          : formValues.comentario,
          p_usuario             : this.userID,
          CONFIG_USER_ID        : this.userID,
          CONFIG_OUT_MSG_ERROR  : '',
          CONFIG_OUT_MSG_EXITO  : ''
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

          this.certifForm.reset();
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

  // actionBtn: string = 'Agregar'
  // cargarFacturaByID(){
  //   if (!this.DATA_CERT.isCreation) {
  //   this.actionBtn = 'Actualizar'
  //     this.certifForm.controls['ordenCompra'  ].setValue(this.DATA_CERT.oc);
  //     this.certifForm.controls['importe'      ].setValue(this.DATA_CERT.importe);
  //     this.certifForm.controls['certificacion'].setValue(this.DATA_CERT.certificacion);
  //     this.certifForm.controls['estFactura'   ].setValue(this.DATA_CERT.id_estado);
  //     this.certifForm.controls['factura'      ].setValue(this.DATA_CERT.factura);
  //     this.certifForm.controls['comentario'   ].setValue(this.DATA_CERT.comentario);

  //     // if (this.DATA_CERT.fecha_facturacion !='null' && this.DATA_CERT.fecha_facturacion != '') {
  //     //   this.certifForm.controls['fechaFact'].setValue(this.DATA_CERT.fecha_facturacion)
  //     // }

  //     if (this.DATA_CERT.fecha_facturacion !='null' && this.DATA_CERT.fecha_facturacion != '') {
  //       let fechaF = this.DATA_CERT.fecha_facturacion
  //       const str   = fechaF.split('/');
  //       const year  = Number(str[2]);
  //       const month = Number(str[1]);
  //       const date  = Number(str[0]);
  //       this.certifForm.controls['fechaFact'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
  //     }
  //   }
  // }

  actionBtn: string = 'Agregar';
  cargarVentaDeclaradaByID(idVD?: any){
    if (this.DATA_CERT) {
      console.log('CERT***', this.DATA_CERT[0]);
      console.log('XYZ*', this.DATA_CERT);

      this.actionBtn = 'Actualizar'
      this.liquidacionService.getCertificacionById(this.DATA_CERT[0].idCertificacion).subscribe((resp: any) => {

        console.log('CARGA_ID_CERT', resp);

        this.certifForm.reset({
          ordenCompra  : resp.orden_compra,
          importe      : resp.importe,
          certificacion: resp.certificacion,
          estFactura   : resp.estado,
          factura      : resp.factura,
          fechaFact    : moment.utc(resp.fecha_facturacion).format('YYYY-MM-DD'),
          comentario   : resp.comentario
        })
      })
    }
  }

  userID: number = 0;
  getUserID(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.result.user.userId;
     console.log('ID-USER', this.userID);
   })
  }

  // getListEstadosCer_xt(){
  //   let parametro: any[] = [{queryId: 106}];

  //   this.facturacionService.getListEstadosCert(parametro[0]).subscribe((resp: any) => {
  //           this.listEstadosCert = resp.list;
  //           console.log('EST-FACTX', resp);
  //   });
  // }

  listEstadosCert: any[] = [];
  getListEstadosCert(){
    this.mantenimientoService.getAllEstados().subscribe((resp: any) => {
      this.listEstadosCert = resp.result.filter((x: any) => x.nombre == 'Facturado' || x.nombre == 'Certificado' || x.nombre == 'Propuesto');
    })
  }

  campoNoValido(campo: string): boolean {
    if (this.certifForm.get(campo)?.invalid && this.certifForm.get(campo)?.touched) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
