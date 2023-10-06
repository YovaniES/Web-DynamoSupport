import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material/material.module';
import { HarosComponent } from './Haros/haros.component';

@NgModule({
    imports: [
        CommonModule,
        SeguridadRoutingModule,
        HarosComponent
    ],
})
export class SeguridadModule {}
