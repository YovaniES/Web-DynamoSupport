import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { BlockUIModule } from 'ng-block-ui';


@NgModule({
    imports: [
    BlockUIModule.forRoot(),
    LoginComponent
]
})
export class AuthModule { }
