import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-modal-hardware',
    templateUrl: './modal-hardware.component.html',
    styleUrls: ['./modal-hardware.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, NgFor, NgIf, MatProgressSpinnerModule]
})
export class ModalHardwareComponent implements OnInit {
  loadingItem: boolean = false;
  userID: number = 0;
  hardwareForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ModalHardwareComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_HARDWARE: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.valueChanges();
    this.getListMarcaHardware();
    this.getListTiposHardware();
    this.getUsuario();
    this.cargarHardwareByID();
    this.getHistoricoHarwareByPersonal(this.DATA_HARDWARE);
    // console.log('DATA_HARDWARE', this.DATA_HARDWARE);
  }

  newForm(){
    this.hardwareForm = this.fb.group({
     tipo        : ['', [Validators.required]],
     marca       : ['', [Validators.required]],
     modelo      : [''],
     serie       : [''],
     imei        : [''],
     observacion : [''],
     equipo      : [''],
     hostname    : [''],
    })
   }

  selectLaptop(): boolean{
    const selectLaptop = this.listTipos.find(h => h.nombre.toUpperCase() == 'LAPTOP')

    return selectLaptop && selectLaptop.id == this.hardwareForm.controls['tipo'].value;
  }

  selectModem(): boolean{
    const selectModem = this.listTipos.find(h => h.nombre.toUpperCase() == 'MODEM')

    return selectModem && selectModem.id == this.hardwareForm.controls['tipo'].value;
  }

  selectMovil(): boolean{
    const selectMovil = this.listTipos.find(h => h.nombre.toUpperCase() == 'EQUIPO MÓVIL')

    return selectMovil && selectMovil.id == this.hardwareForm.controls['tipo'].value;
  }

  crearOactualizarHardware() {
    this.spinner.show();

    if (!this.DATA_HARDWARE) {
      if (this.hardwareForm.valid) {
        this.crearHardware()
      }
    } else {
      this.actualizarHardware();
    }
    this.spinner.hide();
  }

  crearHardware(){
    const formValues = this.hardwareForm.getRawValue();
    let parametro: any =  {
        queryId: 16,
        mapValue: {
          param_id_tipo       : formValues.tipo,
          param_id_marca      : formValues.marca,
          param_descripcion   : formValues.equipo,
          param_modelo        : formValues.modelo,
          param_serie         : formValues.serie,
          param_imei          : formValues.imei,
          param_observacion   : formValues.observacion,
          param_hostname      : formValues.hostname,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: "",
          CONFIG_OUT_MSG_EXITO: "",
        },
      };

    //  console.log('VAOR', this.hardwareForm.value , parametro);
    this.personalService.crearOactualizarHardware(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear Hardware!',
        text: `Hardware: ${formValues.modelo}, creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
  }

   actualizarHardware(){
    this.spinner.show();

    const formValues = this.hardwareForm.getRawValue();
    let parametro: any[] = [{
        queryId: 17,
        mapValue: {
          param_id_recurso    : this.DATA_HARDWARE.id_recurso,
          param_id_tipo       : formValues.tipo,
          param_id_marca      : formValues.marca,
          param_descripcion   : formValues.equipo,
          param_modelo        : formValues.modelo,
          param_serie         : formValues.serie,
          param_imei          : formValues.imei,
          param_observacion   : formValues.observacion,
          param_hostname      : formValues.hostname,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: "",
          CONFIG_OUT_MSG_EXITO: "",
        },
      }];

    this.personalService.actualizarHardware(parametro[0]).subscribe( {next: (resp) => {
      this.spinner.hide();

      // console.log('DATA_ACTUALIZADO', resp);
      this.cargarHardwareByID();
      this.dialogRef.close('Actualizar')

      Swal.fire({
        title: 'Actualizar Hardware!',
        text : `Hardware:  ${formValues.modelo }, actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    }, error: () => {
      Swal.fire(
        'ERROR',
        'No se pudo actualizar el hardware',
        'warning'
      );
    }});
  };

  actionBtn: string = 'Registrar';
  cargarHardwareByID(){
    if (this.DATA_HARDWARE) {
      this.actionBtn = 'Actualizar'
        this.hardwareForm.controls['tipo'       ].setValue(this.DATA_HARDWARE.id_tipo);
        this.hardwareForm.controls['marca'      ].setValue(this.DATA_HARDWARE.id_marca);
        this.hardwareForm.controls['equipo'     ].setValue(this.DATA_HARDWARE.equipo);
        this.hardwareForm.controls['modelo'     ].setValue(this.DATA_HARDWARE.modelo);
        this.hardwareForm.controls['serie'      ].setValue(this.DATA_HARDWARE.serie);
        this.hardwareForm.controls['imei'       ].setValue(this.DATA_HARDWARE.imei);
        this.hardwareForm.controls['observacion'].setValue(this.DATA_HARDWARE.observacion);
        this.hardwareForm.controls['hostname'   ].setValue(this.DATA_HARDWARE.hostname);
    }
  }

  histHardareByPersonal: any[] = [];
  getHistoricoHarwareByPersonal(id: number){
  this.spinner.show();
    let parametro: any[] = [{ queryId: 116, mapValue: {
        param_id_recurso: this.DATA_HARDWARE.id_recurso,
      }
    }];

    this.personalService.getHistoricoHarwareByPersonal(parametro[0]).subscribe((resp: any) => {
      this.histHardareByPersonal = resp.list;
      // console.log('ListHistHARDWARE', resp.list)
    });
    this.spinner.hide();
  }

  campoNoValido(campo: string): boolean {
    if ( this.hardwareForm.get(campo)?.invalid && this.hardwareForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  valueChanges(){
    this.hardwareForm.get('modelo')?.valueChanges.subscribe((valor: string) => {
      this.hardwareForm.patchValue( {modelo: valor.toUpperCase()}, {emitEvent: false});
    });

    this.hardwareForm.get('serie')?.valueChanges.subscribe((valor: string) => {
      this.hardwareForm.patchValue( {serie: valor.toUpperCase()}, {emitEvent: false});
    });

    this.hardwareForm.get('hostname')?.valueChanges.subscribe((valor: string) => {
      this.hardwareForm.patchValue( {hostname: valor.toUpperCase()}, {emitEvent: false});
    });
  }

  getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

   listTipos: any[] = [];
   getListTiposHardware(){
     let arrayParametro: any[] = [{queryId: 32}];

     this.personalService.getListTiposHardware(arrayParametro[0]).subscribe((resp: any) => {
       this.listTipos = resp.list;
     });
   }

   listMarca: any[] = [];
   getListMarcaHardware(){
     let arrayParametro: any[] = [{ queryId: 33 }];

     this.personalService.getListMarcaHardware(arrayParametro[0]).subscribe((resp: any) => {
       this.listMarca = resp.list;
     });
   }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
