import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilService } from 'src/app/core/services/util.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FacturacionService } from 'src/app/core/services/facturacion.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-actualizacion-masiva',
    templateUrl: './actualizacion-masiva.component.html',
    styleUrls: ['./actualizacion-masiva.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, NgFor, NgIf]
})
export class ActualizacionMasivaComponent implements OnInit {
  userID: number = 0;

  facturaForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private facturacionService: FacturacionService,
    private fb: FormBuilder,
    private utilService: UtilService,
    public datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ActualizacionMasivaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_LIQUID: any,
  ) { }

  ngOnInit(): void {
    this.newForm();
    this.getListEstados();
    this.getUserID();
    this.getListProyectos();

    // console.log('DATA_LIQUI', this.DATA_LIQUID);
  }

  newForm(){
    this.facturaForm = this.fb.group({
     id_proyecto : ['', Validators.required],
     fechaPeriodo: ['', Validators.required],
     id_estado   : ['', Validators.required],
    })
   }

   actualizacionMasiva() {
    this.spinner.show();

    const formValues = this.facturaForm.getRawValue();
    let parametro: any =  {
        queryId: 81,
        mapValue:{
          p_idproyecto         : formValues.id_proyecto,
          p_idestado           : formValues.id_estado,
          p_periodo            : this.utilService.generarPeriodo(formValues.fechaPeriodo),
          // p_fechaActualiza     : '',
          // p_idUsuarioActualiza : this.userID,
          p_fecha_actualizacion     : '',
          p_usuario : this.userID,
          CONFIG_USER_ID      : this.userID,
          CONFIG_OUT_MSG_ERROR: '',
          CONFIG_OUT_MSG_EXITO: '',
        }};
    //  console.log('ACT. MASIVA', formValues , parametro);
    this.facturacionService.actualizacionMasiva(parametro).subscribe((resp: any) => {
      Swal.fire({
        title: 'Actualización masiva!',
        text: `Los Proyectos cambiaron de Estado con éxito`,
        icon: 'success',
        confirmButtonText: 'Ok',
      });

      this.close(true);
    });
    this.spinner.hide();
  }

  getUserID(){
    this.authService.getCurrentUser().subscribe( resp => {
      this.userID   = resp.user.userId;
      // console.log('ID-USER', this.userID);
    })
   }

  listEstados: any[] = [];
  getListEstados(){
    let parametro: any[] = [{queryId: 101}];

    this.facturacionService.getListEstados(parametro[0]).subscribe((resp: any) => {
            this.listEstados = resp.list;
            // console.log('EST-FACT', resp);
    });
  }

  listProyectos: any[] = [];
  getListProyectos(){
    let parametro: any[] = [{queryId: 1}];

    this.facturacionService.getListProyectos(parametro[0]).subscribe((resp: any) => {
            this.listProyectos = resp.list;
            // console.log('COD_PROY', resp);
    });
  };

  campoNoValido(campo: string): boolean {
    if (this.facturaForm.get(campo)?.invalid && this.facturaForm.get(campo)?.touched ) {
      return true;
    } else {
      return false;
    }
  }

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
