import { DatePipe, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [ provideRouter(routes), importProvidersFrom(HttpClientModule, ),
      DatePipe,
      { provide: LocationStrategy, useClass: HashLocationStrategy,
          // HTTP_INTERCEPTORS,
          // useClass: AuthInterceptorService,
          // multi: true,
      },
      provideAnimations()
  ]
}
