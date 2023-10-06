import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './views/auth/auth.module';
import { LayoutModule } from '@angular/cdk/layout';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    LayoutModule,
    AuthModule,

  ],
  providers: [
    DatePipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy
      // provide: HTTP_INTERCEPTORS,
      // useClass: AuthInterceptorService,
      // multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
