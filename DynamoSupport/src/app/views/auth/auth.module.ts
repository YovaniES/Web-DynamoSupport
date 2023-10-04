import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/material/material.module';
import { LoginComponent } from './login/login.component';
import { BlockUIModule } from 'ng-block-ui';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    AuthRoutingModule,
    CoreModule,
    MatIconModule,
    MaterialModule,

    BlockUIModule.forRoot()
  ]
})
export class AuthModule { }
