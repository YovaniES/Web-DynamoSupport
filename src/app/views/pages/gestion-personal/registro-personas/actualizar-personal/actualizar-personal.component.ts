import { DatePipe, NgIf, NgClass, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';
import { AsignarHardwareComponent } from './asignar-hardware/asignar-hardware.component';
import { AsignarCuentaComponent } from './asignar-cuenta/asignar-cuenta.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-actualizar-personas',
    templateUrl: './actualizar-personal.component.html',
    styleUrls: ['./actualizar-personal.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, NgIf, NgClass, NgFor, MatTooltipModule, MatProgressSpinnerModule]
})
export class ActualizarPersonalComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  personalForm!: FormGroup;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ActualizarPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_PERSONAL: any
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.cargarPersonalById();
    this.getListProyectos();
    this.getListPerfiles();
    this.getHistoricoCambiosProyecto(this.DATA_PERSONAL);
    this.getUsuario();
    this.getListCategorias();
    this.ListaHardwareAsignado();
    this.ListaCuentaAsignado();
    console.log('DATA_PERSONA', this.DATA_PERSONAL);
  }

    newForm(){
      this.personalForm = this.fb.group({
       idPersonal     : [''],
       nombre         : ['', [Validators.required]],
       apPaterno      : [''],
       apMaterno      : [''],
       dni            : [''],
       correo         : [''],
       fechaNacimiento: [''],
       codCorp        : [''],
       codPerfil      : [''],
       descPerfil     : [''],
       fechaIngreso   : [''],
       id_proyecto    : [''],
       descProy       : [''],
       estado         : [''],
       perfil         : [''],
       proyecto       : [''],
       categoria      : ['']
      })
     }

   userID: number = 0;
   getUsuario(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.result.user.userId;
      // console.log('ID-USER', this.userID);
    })
   };

  actualizarPersonal(){
    this.spinner.show();

    const formValues = this.personalForm.getRawValue();
    let parametro: any[] = [{
        queryId: 8,
        mapValue: {
          param_id_persona        : formValues.idPersonal,
          param_codigo_corporativo: formValues.codCorp,
          param_nombres           : formValues.nombre,
          param_apellido_paterno  : formValues.apPaterno,
          param_apellido_materno  : formValues.apMaterno,
          param_dni               : formValues.dni,
          param_correo            : formValues.correo,
          param_fecha_ingreso     : formValues.fechaIngreso,
          param_fecha_nacimiento  : formValues.fechaNacimiento,
          param_id_proyecto       : formValues.id_proyecto,
          param_id_perfil         : formValues.codPerfil,
          param_estado            : 1,
          param_id_categoria      : formValues.categoria,
          CONFIG_USER_ID          : this.userID,
          CONFIG_OUT_MSG_ERROR    : "",
          CONFIG_OUT_MSG_EXITO    : "",
        },
      }];
    this.personalService.actualizarPersonal(parametro[0]).subscribe( resp => {
      this.spinner.hide();
      // console.log('DATA_ACTUALIZADO', resp);

      this.cargarPersonalById();
      this.close(true)

      Swal.fire({
        title: 'Actualizar Personal!',
        text : `El Personal:  ${ formValues.nombre +' '+formValues.apPaterno }, fue actualizado con éxito`,
        icon : 'success',
        confirmButtonText: 'Ok'
        })
    });
  };

  cargarPersonalById(){
    this.spinner.show();
        this.personalForm.controls['idPersonal' ].setValue(this.DATA_PERSONAL.id);
        this.personalForm.controls['nombre'     ].setValue(this.DATA_PERSONAL.nombres);
        this.personalForm.controls['apPaterno'  ].setValue(this.DATA_PERSONAL.apellido_paterno);
        this.personalForm.controls['apMaterno'  ].setValue(this.DATA_PERSONAL.apellido_materno);
        this.personalForm.controls['dni'        ].setValue(this.DATA_PERSONAL.dni);
        this.personalForm.controls['correo'     ].setValue(this.DATA_PERSONAL.correo);
        this.personalForm.controls['codCorp'    ].setValue(this.DATA_PERSONAL.codigo_corporativo);
        this.personalForm.controls['codPerfil'  ].setValue(this.DATA_PERSONAL.id_perfil);
        this.personalForm.controls['perfil'     ].setValue(this.DATA_PERSONAL.perfil);
        this.personalForm.controls['proyecto'   ].setValue(this.DATA_PERSONAL.codigo_proyecto);
        this.personalForm.controls['id_proyecto'].setValue(this.DATA_PERSONAL.id_proyecto);
        this.personalForm.controls['descProy'   ].setValue(this.DATA_PERSONAL.proyecto_descripcion);
        this.personalForm.controls['categoria'  ].setValue(this.DATA_PERSONAL.id_categoria);

        this.personalForm.controls['estado'].setValue(this.DATA_PERSONAL.estado);

        if (this.DATA_PERSONAL.fecha_ingreso) {
          let fechaIngr = this.DATA_PERSONAL.fecha_ingreso
          const str   = fechaIngr.split('/');
          const year  = Number(str[2]);
          const month = Number(str[1]);
          const date  = Number(str[0]);
          this.personalForm.controls['fechaIngreso'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
        }

        if (this.DATA_PERSONAL.fecha_nacimiento) {
          let fechaNac = this.DATA_PERSONAL.fecha_nacimiento
          const str   = fechaNac.split('/');
          const year  = Number(str[2]);
          const month = Number(str[1]);
          const date  = Number(str[0]);
          this.personalForm.controls['fechaNacimiento'].setValue(this.datePipe.transform(new Date(year, month-1, date), 'yyyy-MM-dd'))
        }
      this.spinner.hide();
  }

  desasignarRecurso(idRecurso: number){
    this.spinner.show();

    let parametro:any[] = [{
      "queryId": 26,
      "mapValue": {
        "param_id_persona"    : this.DATA_PERSONAL.id,
        "param_id_recurso"    : idRecurso,
        "CONFIG_USER_ID"      : this.userID,
        "CONFIG_OUT_MSG_ERROR": '',
        "CONFIG_OUT_MSG_EXITO": ''
      }
    }];
      Swal.fire({
        title: '¿Desasignar Recurso?',
        text: `¿Estas seguro que desea Desasignar el recurso: ${idRecurso}?`,
        icon: 'question',
        confirmButtonColor: '#ec4756',
        cancelButtonColor : '#0d6efd',
        confirmButtonText : 'Si, Desasignar!',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((resp) => {
        if (resp.value) {
          this.personalService.desasignarRecurso(parametro[0]).subscribe(resp => {
            this.ListaHardwareAsignado();
            this.ListaCuentaAsignado();

              Swal.fire({
                title: 'Desasignar Recurso',
                text : `El Recurso: ${idRecurso}, fue desasignado con éxito`,
                icon : 'success',
              });
            });
        }
    });
    this.spinner.hide();
  }

  totalHardareAsignado: number = 0;
  listHardwareAsignado: any[]=[];
  ListaHardwareAsignado(){
    this.listHardwareAsignado = [];

    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 27,
      "mapValue": {
      "param_id_persona": this.DATA_PERSONAL.id,
      }
    }];

    this.personalService.ListaHardwareAsignado(parametro[0]).subscribe( (resp: any) => {
      this.listHardwareAsignado = resp.list;
      this.totalHardareAsignado = resp.list.length
      console.log('HARD-ASIG', resp.list, this.totalHardareAsignado);
    })
  }

  totalCuentaAsignado: number = 0;
  listCuentaAsignado: any[]=[];
  ListaCuentaAsignado(){
    this.spinner.show();
    let parametro:any[] = [{
      "queryId": 28,
      "mapValue": {
      "param_id_persona": this.DATA_PERSONAL.id,
      }
    }];

    this.personalService.ListaCuentaAsignado(parametro[0]).subscribe( (resp: any) => {
      this.listCuentaAsignado = resp.list;
      this.totalCuentaAsignado = resp.list.length;
      // console.log('CUENT-ASIG', resp.list, this.totalCuentaAsignado);
    })
  }

  histCambiosProyecto: any[] = [];
  getHistoricoCambiosProyecto(id: number){
  this.spinner.show();
    let parametro: any[] = [{ queryId: 57, mapValue: {
        param_id_persona: this.DATA_PERSONAL.id,
      }
    }];
    this.personalService.getHistoricoCambiosProyecto(parametro[0]).subscribe((resp: any) => {
      this.histCambiosProyecto = resp.list;
      // console.log('ListHistCambID', resp)
    });
    this.spinner.hide();
  }

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.personalService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp.list;
            // console.log('ID_PROYECTOS', resp.list);
    });
  };

  listPerfiles: any[] = [];
  getListPerfiles(){
    let parametro: any[] = [{queryId: 10}];

    this.personalService.getListPerfiles(parametro[0]).subscribe((resp: any) => {
            this.listPerfiles = resp.list;
            // console.log('PERFILES', resp.list);
    });
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  };

  listCategorias: any[] = [];
  getListCategorias() {
    let arrayParametro: any[] = [{ queryId: 145 }];

    this.personalService.getListProyectos(arrayParametro[0]).subscribe((resp: any) => {
        this.listCategorias = resp.list;
        console.log('CATEGORIAS', resp);
      });
  }


  campoNoValido(campo: string): boolean {
    if ( this.personalForm.get(campo)?.invalid && (this.personalForm.get(campo)?.dirty || this.personalForm.get(campo)?.touched) ) {
      return true;
    } else {
      return false;
    }
  }

  asignarHardware(){
    const dialogRef = this.dialog.open(AsignarHardwareComponent, { width:'35%', data: this.personalForm.value });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.ListaHardwareAsignado()
      }
    })
  };

  agregarCuenta(){
    const dialogRef = this.dialog.open(AsignarCuentaComponent, { width:'35%', data: this.personalForm.value });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.ListaCuentaAsignado()
      }
    })
  };

}







