import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { PersonalService } from 'src/app/core/services/personal.service';
import Swal from 'sweetalert2';
import { FirstCapitalPipe } from '../../../../../../core/pipes/first-capital.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-asignar-cuenta',
    templateUrl: './asignar-cuenta.component.html',
    styleUrls: ['./asignar-cuenta.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, MatTooltipModule, NgFor, NgIf, MatProgressSpinnerModule, NgxPaginationModule, FirstCapitalPipe]
})
export class AsignarCuentaComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  filtroForm!: FormGroup;

  page = 1;
  totalCuenta: number = 0;
  pageSize = 5;

  constructor(
    private personalService: PersonalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<AsignarCuentaComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_PERSONA: any
  ) { }

  ngOnInit(): void {
    this.getUsuario()
    this.newFilfroForm();
    this.cargarOBuscarCuentaDisponible();
    console.log('ID_PERSON_REC', this.DATA_PERSONA);
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      username : [''],
    })
  }

  userID: number = 0;
  getUsuario(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.user.userId;
     // console.log('ID-USER', this.userID);
   })
  }


  // listaCuentaDisp: any[] = [];
  cargarOBuscarCuentaDisponibleX(){
    this.blockUI.start("Cargando listado de cuentas...");
    let parametro: any[] = [{
      "queryId": 44,
      // "queryId": 44,
      "mapValue": {
        param_username: this.filtroForm.value.username,
      }
    }];
    this.personalService.cargarOBuscarCuentaDisponible(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Cuenta-disp', resp.list, resp.list.length);
      this.listaCuentaDisp = [];
      this.listaCuentaDisp = resp.list;

      this.spinner.hide();
    });
  }

  listaCuentaDisp: any[] = [];
  cargarOBuscarCuentaDisponible(){
    this.blockUI.start("Cargando listado de cuentas...");
    let parametro: any[] = [{
      "queryId": 24,
      // "mapValue": { param_username    : this.filtroForm.value.username }
    }];
    this.personalService.cargarOBuscarCuentaDisponible(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Cuenta-disp', resp.list, resp.list.length);
      this.listaCuentaDisp = [];
      this.listaCuentaDisp = resp.list;

      this.spinner.hide();
    });
  }

  asignarCuenta(idRecurso: number, nameCuenta: string){
    this.spinner.show();

    if (this.DATA_PERSONA.estado == 'Activo') {
      let parametro: any[] = [{
        "queryId": 25,
        "mapValue": {
          "param_id_persona": this.DATA_PERSONA.idPersonal,
          "param_id_recurso": idRecurso,
          "CONFIG_USER_ID"  : this.userID, //this.authService.getCurrentUser(),
          "CONFIG_OUT_MSG_ERROR":'',
          "CONFIG_OUT_MSG_EXITO":''}
      }];
      this.personalService.asignarRecurso( parametro[0]).subscribe( resp => {
        this.close(true);

        Swal.fire({
          title: 'Asignar recurso cuenta',
          text: `El recurso Cuenta: ${nameCuenta}, se asignó con exito`,
          icon: 'success',
        })
      })
    } else {
      Swal.fire({
        title: 'Asignar recurso cuenta',
        text: `No se pudo asignar el Cuenta: ${nameCuenta}, cuando el personal este Inactivo`,
        icon: 'error',
      });
    }
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})

    this.cargarOBuscarCuentaDisponible();
  };

  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalCuenta) {
      this.personalService.cargarOBuscarCuentaDisponible(offset.toString()).subscribe( (resp: any) => {
            this.listaCuentaDisp = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }
  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }
}
