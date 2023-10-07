import { DatePipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/services/auth.service';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import { FirstCapitalPipe } from '../../../../../../core/pipes/first-capital.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-asignar-personal',
    templateUrl: './asignar-personal.component.html',
    styleUrls: ['./asignar-personal.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, MatTooltipModule, NgFor, NgIf, MatProgressSpinnerModule, NgxPaginationModule, UpperCasePipe, FirstCapitalPipe]
})
export class AsignarPersonalComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  filtroForm!: FormGroup;

  page = 1;
  totalPersonal: number = 0;
  pageSize = 4;

  constructor(
    private vacacionesService: VacacionesPersonalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialogRef: MatDialogRef<AsignarPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_PERSONA: any
  ) { }

  ngOnInit(): void {
    this.newFilfroForm();
    this.getUsuario()
    this.cargarOBuscarPersonalActivo();
    // console.log('ID_PERSON_REC', this.DATA_PERSONA);
  }

  newFilfroForm(){
    this.filtroForm = this.fb.group({
      nombres     : [''],
      apellidos   : [''],
      codigo_corp : [''],
    })
  }

  userID: number = 0;
  getUsuario(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   = resp.result.user.userId;
     // console.log('ID-USER', this.userID);
   })
  }

  listaPersonalActivo: any[] = [];
  cargarOBuscarPersonalActivo(){
    this.blockUI.start("Cargando personal...");
    let parametro: any[] = [{
      "queryId": 134,
      "mapValue": {
          nombre   : this.filtroForm.value.nombres + " " + this.filtroForm.value.apellidos,
          // apellidos: this.filtroForm.value.apellidos,
          cod_corp : this.filtroForm.value.codigo_corp,
      }
    }];
    this.vacacionesService.cargarOBuscarPersonalActivo(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('Lista-Personal_ACT', resp, resp.list.length);
      this.listaPersonalActivo = [];
      this.listaPersonalActivo = resp.list;

      this.spinner.hide();
    });
  }

  asignarPersonal(persona: any){
    console.log('persona', persona);
    this.close(persona)
  }

  limpiarFiltro() {
    this.filtroForm.reset('', {emitEvent: false})
    this.newFilfroForm();

    this.cargarOBuscarPersonalActivo();
  };

  listPageDisp: any[] = [];
  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalPersonal) {
      this.vacacionesService.cargarOBuscarPersonalActivo(offset.toString()).subscribe( (resp: any) => {
            this.listPageDisp = resp.list;
            this.spinner.hide();
          });
    } else {
      this.spinner.hide();
    }
      this.page = event;
  }

  close(succes?: any) {
    this.dialogRef.close(succes);
  }
}


