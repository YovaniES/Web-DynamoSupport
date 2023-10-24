import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { first } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        NgIf,
        MatProgressSpinnerModule,
    ],
})
export class LoginComponent {
  @BlockUI() blockUI!: NgBlockUI;
  loadingItem: boolean = false;

  loginForm: FormGroup = this.fb.group({
    idaplicacion: [1],
    username    : ['', [Validators.required]],
    password    : ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}


  login() {
    this.blockUI.start('Iniciando Sesión...');

    this.authService.login(this.loginForm.value)
      .pipe(first())
      .subscribe((resp) => {
        this.blockUI.stop();

          if (resp && resp.result.user.idAplicacion == 1) {
            // this.spinner.hide();

            Swal.fire(
              'Inicio de Sesión',
              'Bienvenid@ <br />' + `${resp.result.user.nombres} ${resp.result.user.apellidoPaterno}`,
              'success'
            );
            this.router.navigateByUrl('home');
          } else {
            Swal.fire(
              'Error',
              'Credenciales Incorrectas para esta aplicación',
              'error'
            );
          }
        });
  }

  campoNoValido(campo: string): boolean {
    if (
      this.loginForm.get(campo)?.invalid &&
      this.loginForm.get(campo)?.touched
    ) {
      return true;
    } else {
      return false;
    }
  }
}
