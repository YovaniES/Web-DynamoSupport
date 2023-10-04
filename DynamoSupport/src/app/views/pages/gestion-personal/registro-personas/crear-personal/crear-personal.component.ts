import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-personas',
  templateUrl: './crear-personal.component.html',
  styleUrls: ['./crear-personal.component.scss']
})
export class CrearPersonalComponent implements OnInit {
  userID: number = 0;
  personalForm!: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<CrearPersonalComponent>,
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.valueChanges();
    this.getListProyectos();
    this.getUserID();
    this.getListPerfiles();
    this.getListLideres();
  }

  newForm(){
    this.personalForm = this.fb.group({
     nombre         : ['', [Validators.required]],
     apPaterno      : ['', [Validators.required]],
     apMaterno      : ['', [Validators.required]],
     dni            : [''],
     correo         : ['', [Validators.required, Validators.email,Validators.pattern(this.emailPattern)]],
     fechaNacimiento: [''],
     codCorp        : ['', [Validators.required]],
     codPerfil      : ['', [Validators.required]],
     descPerfil     : [''],
     fechaIngreso   : ['', [Validators.required]],
     codProy        : ['', [Validators.required]],
     descProy       : [''],
    //  categoria      : ['']
    })
   }

   getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      console.log('ID-USER', this.userID);
    })
   }

  crearPersonal() {
    this.spinner.show();
    const formValues = this.personalForm.getRawValue();

    let parametro: any =  {
        queryId: 7,
        mapValue: {
          param_codigo_corporativo: formValues.codCorp,
          param_nombres           : formValues.nombre,
          param_apellido_paterno  : formValues.apPaterno,
          param_apellido_materno  : formValues.apMaterno,
          param_dni               : formValues.dni,
          param_correo            : formValues.correo,
          param_fecha_ingreso     : formValues.fechaIngreso,
          param_fecha_nacimiento  : formValues.fechaNacimiento,
          param_id_proyecto       : formValues.codProy,
          param_id_perfil         : formValues.codPerfil,
          // param_id_categoria      : '',
          CONFIG_USER_ID          : this.userID,
          CONFIG_OUT_MSG_ERROR    : "",
          CONFIG_OUT_MSG_EXITO    : "",
        },
      };
     console.log('VAOR', this.personalForm.value , parametro);
    this.personalService.crearPersonal(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Crear personal!',
        text: `Personal: ${formValues.nombre+ ' '+ formValues.apMaterno + ' '+ formValues.apMaterno}, creado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.close(true);
    });
    this.spinner.hide();
  }

  valueChanges(){
    this.personalForm.get('codProy')?.valueChanges.subscribe((valor: string) => {
      this.personalForm.patchValue( {codProy: valor.toUpperCase()}, {emitEvent: false});
    });
  }

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.personalService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp.list;
            console.log('COD_PROY', resp);
    });
  };

  listPerfiles: any[] = [];
  getListPerfiles(){
    let parametro: any[] = [{queryId: 10}];

    this.personalService.getListPerfiles(parametro[0]).subscribe((resp: any) => {
            this.listPerfiles = resp.list;
            // console.log('PERFILES', resp);
    });
  };


  listLideres: any[] = [];
  getListLideres(){
    let parametro: any[] = [{queryId: 149}];

    this.personalService.getListLideres(parametro[0]).subscribe((resp: any) => {
            this.listLideres = resp.list;
            console.log('LIDERES', resp);
    });
  }

  descProyecto: string ='';
  getDescProy(id: any) {
    let parametro: any[] = [{ queryId: 2, mapValue: { param_id_proyecto: id }}];

    this.personalService.getDescProy(parametro[0]).subscribe((resp: any) => {
      this.descProyecto = resp.list.map((d: any) => d.valor_texto_2)

      console.log('DESC-PROYX', this.descProyecto);
    });
  }

  descPerfil: any;
  getDescPerfil(id: any){
    let parametro: any[] = [{queryId: 11, mapValue: {param_id_perfil: id} }];

    this.personalService.getDescPerfil(parametro[0]).subscribe((resp: any) => {
            this.descPerfil = resp.list.map((perfil: any) => perfil.descripcion);
            console.log('DESC-PERFIL', resp);
    });
  }

  campoNoValido(campo: string): boolean {
    if ( this.personalForm.get(campo)?.invalid && (this.personalForm.get(campo)?.dirty || this.personalForm.get(campo)?.touched) ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
