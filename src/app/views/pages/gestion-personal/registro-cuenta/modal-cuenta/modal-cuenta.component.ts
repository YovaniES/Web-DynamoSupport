import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-modal-cuenta',
    templateUrl: './modal-cuenta.component.html',
    styleUrls: ['./modal-cuenta.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, NgIf, NgFor]
})
export class ModalCuentaComponent implements OnInit {
  userID: number = 0;
  cuentaForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ModalCuentaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_CUENTA: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListTiposCuentas();
    this.cargarCuentasByID();
    this.userId();
  }

  newForm(){
   this.cuentaForm = this.fb.group({
    usuario : ['', [Validators.required]],
    password: [''],
    idTipo  : ['', [Validators.required]],
   })
  }

  userId() {
    this.authService.getCurrentUser().subscribe((resp) => {
      this.userID = resp.userId;
      // console.log('ID-USER', this.userID);
    });
  }

  crearOactualizarCuenta() {
    // console.log('CUENTAS', this.cuentaForm.value);

    this.spinner.show();
    if (!this.DATA_CUENTA) {
      if (this.cuentaForm.valid) {this.crearCuenta();}
    } else {
      this.actualizarCuenta();
    }
      this.spinner.hide();
  }

  crearCuenta(){
    const formValues = this.cuentaForm.getRawValue();

    let parametro: any =  {
        queryId: 19,
        mapValue: {
          param_usuario       : formValues.usuario,
          param_password      : formValues.password,
          param_id_tipo       : formValues.idTipo,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: "",
          CONFIG_OUT_MSG_EXITO: "",
        },
      };
    //  console.log('VAOR', this.cuentaForm.value , parametro);
    this.personalService.crearOactualizarCuenta(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear cuenta!',
        text : `Cuenta: ${formValues.usuario}, creado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
  }

  actualizarCuenta() {
    this.spinner.show();

    const formValues = this.cuentaForm.getRawValue();
    let parametro: any[] = [{ queryId: 20,
        mapValue: {
          param_id_recurso              : this.DATA_CUENTA.id,
          param_usuario                 : formValues.usuario,
          param_password                : formValues.password,
          param_id_tipo                 : formValues.idTipo,
          param_fecha_ultima_renovacion : '',
          param_fecha_proxima_renovacion: '',
          CONFIG_USER_ID                : this.userID,
          CONFIG_OUT_MSG_ERROR          : "",
          CONFIG_OUT_MSG_EXITO          : "",
        },
      }];
    this.personalService.actualizarCuenta(parametro[0]).subscribe({
        next: (res) => {
        this.spinner.hide();

        this.close(true)
          Swal.fire({
            title: 'Actualizar Cuenta!',
            text : `La cuenta:  ${formValues.usuario }, se actualizó con éxito`,
            icon : 'success',
            confirmButtonText: 'Ok'
            });

          this.cuentaForm.reset();
          this.dialogRef.close('Actualizar');
        }, error:()=>{
          Swal.fire(
            'ERROR',
            'No se pudo actualizar el usuario',
            'warning'
          );
        }
     });
  }

  actionBtn: string = 'Registrar'
  cargarCuentasByID(){
    if (this.DATA_CUENTA) {
      this.actionBtn = 'Actualizar'
        this.cuentaForm.controls['usuario' ].setValue(this.DATA_CUENTA.usuario);
        this.cuentaForm.controls['password'].setValue(this.DATA_CUENTA.password);
        this.cuentaForm.controls['idTipo'  ].setValue(this.DATA_CUENTA.id_tipo);
    }
  }

  tipos: any[] = [];
  getListTiposCuentas() {
    let Parametro: any[] = [{ queryId: 40}];
    this.personalService.getListTiposCuentas(Parametro[0]).subscribe((resp: any) => {
      this.tipos = resp.list;
      // console.log('TIPOS', resp);
    });
  }

  campoNoValido(campo: string): boolean {
    if ( this.cuentaForm.get(campo)?.invalid && this.cuentaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}

