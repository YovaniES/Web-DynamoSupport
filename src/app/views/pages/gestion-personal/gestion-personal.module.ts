import { NgModule } from '@angular/core';

import { GestionPersonalRoutingModule } from './gestion-personal-routing.module';
import { RegistroCuentaComponent } from './registro-cuenta/registro-cuenta.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from 'src/app/material/material.module';

import { RegistroHardwareComponent } from './registro-hardware/registro-hardware.component';
import { RegistroPersonalComponent } from './registro-personas/registro-personal.component';
import { ActualizarPersonalComponent } from './registro-personas/actualizar-personal/actualizar-personal.component';
import { CrearPersonalComponent } from './registro-personas/crear-personal/crear-personal.component';
import { AsignarHardwareComponent } from './registro-personas/actualizar-personal/asignar-hardware/asignar-hardware.component';
import { AsignarCuentaComponent } from './registro-personas/actualizar-personal/asignar-cuenta/asignar-cuenta.component';
import { ModalHardwareComponent } from './registro-hardware/modal-hardware/modal-hardware.component';
import { ModalCuentaComponent } from './registro-cuenta/modal-cuenta/modal-cuenta.component';
import { RegistroVacacionesComponent } from './registro-vacaciones/registro-vacaciones.component';
import { ActualizarVacacionesComponent } from './registro-vacaciones/actualizar-vacaciones/actualizar-vacaciones.component';
import { AsignarPersonalComponent } from './registro-vacaciones/crear-vacaciones/asignar-personal/asignar-personal.component';
import { CrearVacacionesComponent } from './registro-vacaciones/crear-vacaciones/crear-vacaciones.component';
import { AsignarVacacionesComponent } from './registro-vacaciones/actualizar-vacaciones/asignar-vacaciones/asignar-vacaciones.component';
import { EnviarCorreoComponent } from './registro-vacaciones/enviar-correo/enviar-correo.component';

@NgModule({
    imports: [
    GestionPersonalRoutingModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    MaterialModule,
    RegistroCuentaComponent,
    RegistroHardwareComponent,
    RegistroPersonalComponent,
    CrearPersonalComponent,
    ActualizarPersonalComponent,
    AsignarHardwareComponent,
    AsignarCuentaComponent,
    ModalHardwareComponent,
    ModalCuentaComponent,
    RegistroVacacionesComponent,
    ActualizarVacacionesComponent,
    AsignarVacacionesComponent,
    AsignarPersonalComponent,
    CrearVacacionesComponent,
    EnviarCorreoComponent,
]
})
export class GestionPersonalModule { }
