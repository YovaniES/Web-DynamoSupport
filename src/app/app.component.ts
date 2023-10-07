import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseComponent } from './layout/base/base.component';
import { AuthModule } from './views/auth/auth.module';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet, AuthModule,],
})
export class AppComponent {
  title = 'DynamoSupport';
}
