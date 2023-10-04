import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroCuentaComponent } from './registro-cuenta/registro-cuenta.component';
import { RegistroHardwareComponent } from './registro-hardware/registro-hardware.component';
import { RegistroPersonalComponent } from './registro-personas/registro-personal.component';
import { RegistroVacacionesComponent } from './registro-vacaciones/registro-vacaciones.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'personas', component: RegistroPersonalComponent},
      { path: 'vacaciones', component: RegistroVacacionesComponent},
      { path: 'hardware', component: RegistroHardwareComponent},
      { path: 'cuentas' , component: RegistroCuentaComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPersonalRoutingModule { }
