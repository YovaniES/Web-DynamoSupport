import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports:[MatIconModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;
  vacacionesForm!: FormGroup;
  fullname!: string;
  subtitle: string = 'Usuario';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    public datePipe: DatePipe,
    private router: Router,
    private dialogRef: MatDialogRef<LogoutComponent>,
  ) { }

  ngOnInit(): void {
    this.fullname = this.authService.getUsername();

    this.newForm();
    this.getUsuario();
  }

    newForm(){
      this.vacacionesForm = this.fb.group({
       idPersonal    : [''],
       codCorp       : [''],
       nombre        : ['', [Validators.required]],
       apPaterno     : [''],
       apMaterno     : [''],
       proyecto      : [''],
       fechaInicVac  : ['', [Validators.required]],
       fechaFinVac   : ['', [Validators.required]],
       fecha_ingreso : [''],
       id_estado_vac : [''],
       idSistema     : ['', [Validators.required]],
       idTipoVac     : ['', [Validators.required]],
       total_dias_vac: ['']
      })
     }


  userID: number = 0;
  userLogeado: string = '';
  getUsuario(){
   this.authService.getCurrentUser().subscribe( resp => {
     this.userID   =  resp.result.user.userId;
    //  this.userID   = resp.result,  resp.result.user.userId;
     this.userLogeado = `${resp.result.user.nombres} ${resp.result.user.apellidoPaterno}`
     console.log('USER_lOGEADO', this.userID, this.userLogeado);
     console.log('USER_ID_LOG', this.userID);
   })
  };

  close(succes?: boolean) {
    this.dialogRef.close(succes);
  }

  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('/auth');
  }

}
