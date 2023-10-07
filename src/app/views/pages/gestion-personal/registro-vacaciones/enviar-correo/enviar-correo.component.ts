import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgxSpinnerService } from 'ngx-spinner';
import { VacacionesPersonalService } from 'src/app/core/services/vacaciones-personal.service';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-enviar-correo',
    templateUrl: './enviar-correo.component.html',
    styleUrls: ['./enviar-correo.component.scss'],
    standalone: true,
    imports: [MatIconModule, FormsModule, ReactiveFormsModule, NgFor, MatTooltipModule, NgIf, MatProgressSpinnerModule]
})
export class EnviarCorreoComponent implements OnInit {
  @ViewChild('tabla') tabla!: ElementRef;

  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  mailForm!: FormGroup;

  page = 1;
  totalPeriodoLider: number = 0;
  pageSize = 4;

  constructor(
    private vacacionesService: VacacionesPersonalService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private dialogRef: MatDialogRef<EnviarCorreoComponent>,
    @Inject(MAT_DIALOG_DATA) public DATA_PERSONA: any
  ) { }

  ngOnInit(): void {
    this.getListEstadoVacaciones();
    this.getListAdminVacaciones();
    this.newFilfroForm();
  }

  newFilfroForm(){
    this.mailForm = this.fb.group({
      id_responsable: ['', Validators.required],
      id_estado_per : ['', Validators.required],
      destinatario  : ['', Validators.required],
      mensaje       : [''],
    })
  }

  listLiderMail: any[] = [];
  cargarOBuscarCorreoLider(){
    this.listLiderMail = [];

    this.blockUI.start("Cargando periodos...");
    let parametro: any[] = [{
      "queryId": 147,
      "mapValue": {
        p_id_responsable: this.mailForm.value.id_responsable,
        p_id_per_estado : this.mailForm.value.id_estado_per,
      }
    }];

    this.vacacionesService.cargarOBuscarCorreoLider(parametro[0]).subscribe((resp: any) => {
    this.blockUI.stop();

     console.log('LISTA DE PERIOX', resp, resp.list.length);
      this.listLiderMail = resp.list;

      this.spinner.hide();
    });
  }

  listEstadoVacaciones: any[] = [];
  getListEstadoVacaciones(){
  let parametro: any[] = [{ queryId: 148}];
  this.vacacionesService.getListEstadoVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listEstadoVacaciones = resp.list;
    // console.log('VACAC-ESTADO', resp.list);
    })
  }

  listAdminVacaciones: any[] = [];
  getListAdminVacaciones(){
  let parametro: any[] = [{ queryId: 127}];
  this.vacacionesService.getListAdminVacaciones(parametro[0]).subscribe((resp: any) => {
    this.listAdminVacaciones = resp.list;
    console.log('RESPONSABLES-VACAS', resp.list);
    })
  }

  asignarCorreo(){
    const selectLider = this.listAdminVacaciones.find( admin => admin.id == this.mailForm.controls['id_responsable'].value);

    this.mailForm.controls['destinatario'].setValue(selectLider? selectLider.correo: '');
  }

  enviarCorreo(){
    // console.log('ABC', this.tabla.nativeElement.innerHTML);
    const body = {
      from: "abc@gmail.com",
      to  : this.mailForm.controls['destinatario'].value ,
      body: this.tabla.nativeElement.innerHTML
    }
    this.vacacionesService.enviarCorreo(body).subscribe();
    this.spinner.hide();

    Swal.fire({
      title: 'Enviar mensaje!',
      text : `El mensaje fue enviado con éxito`,
      icon : 'success',
      confirmButtonText: 'Ok',
    });
    this.close(true);
    this.spinner.show();
  }

  limpiarFiltro() {
    this.mailForm.reset('', {emitEvent: false})
    this.newFilfroForm();

    this.cargarOBuscarCorreoLider();
  };

  listPageDisp: any[] = [];
  totalfiltro = 0;
  cambiarPagina(event: number) {
    let offset = event*10;
    this.spinner.show();

    if (this.totalfiltro != this.totalPeriodoLider) {
      this.vacacionesService.cargarOBuscarCorreoLider(offset.toString()).subscribe( (resp: any) => {
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
