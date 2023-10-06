import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';

import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { LoginComponent } from './login/login.component';
import { BlockUIModule } from 'ng-block-ui';


@NgModule({
    imports: [
    AuthRoutingModule,
    MatIconModule,
    MaterialModule,
    BlockUIModule.forRoot(),
    LoginComponent
]
})
export class AuthModule { }
