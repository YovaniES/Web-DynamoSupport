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
      this.cargarCertificacionByID(this.DATA_CERT.idFactura)
      console.log('DATA_CERT', this.DATA_CERT);
      // console.log('DATA_CERT_ID', this.DATA_CERT.certifForm.idCertificacion);
      console.log('ID_CERT_MODAL', this.DATA_CERT.idCertificacion);
    }
  }

  certifForm!: FormGroup;
  newForm(){
    this.certifForm = this.fb.group({
     ordenCompra   : ['',[Validators.required]],
     importe       : ['',[Validators.required]],
     certificacion : ['',[Validators.required]],
     estFactura    : [182,[Validators.required]],
     factura       : ['',[Validators.required]],
     fechaFact     : ['',[Validators.required]],
     comentario    : [''],
    })
   }

  crearOactualizarCertificacion(){
    if (this.certifForm.invalid) {
      return Object.values(this.certifForm.controls).forEach((controls) => {
        controls.markAllAsTouched();
      })
    }

    const idCert = this.certifForm.get('idCertifacion')?.value;

    if (idCert > 0) {
      if (this.certifForm.valid) {
        console.log('ACT_CERT');
        this.actualizarCertificacion();
      }
    } else {
      console.log('CREAR_CERT');
      this.crearCertificacion()
    }
  }

  crearCertificacion(): void{
    const formValues = this.certifForm.getRawValue();

    const request = {
      idFactura       : this.DATA_CERT.certifForm.idFactura,
      fechaFacturacion: formValues.fechaFact,
      importe         : formValues.importe,
      idEstado        : formValues.estFactura,
      orden_compra    : formValues.ordenCompra,
      certificacion   : formValues.certificacion,
      factura         : formValues.factura,
      comentario      : formValues.comentario,
      usuario         : this.userID,
    }

    this.liquidacionService.crearCertificacion(request).subscribe((resp: any) => {
      if (resp.message) {
        Swal.fire({
          title: 'Crear certificación!',
          text: `${resp.message}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.close(true);
      }
    })
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

  actionBtn: string = 'Crear';
  cargarCertificacionByID(idCert?: any){
    if (!this.DATA_CERT.isCreation) {
      console.log('XYZ*', this.DATA_CERT);

      this.actionBtn = 'Actualizar'
      this.liquidacionService.getCertificacionById(this.DATA_CERT.idCertificacion).subscribe((resp: any) => {

        console.log('CARGA_ID_CERT', resp);

        this.certifForm.reset({
          ordenCompra  : resp.orden_compra,
          importe      : resp.importe,
          certificacion: resp.certificacion,
          estFactura   : resp.idEstado,
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
