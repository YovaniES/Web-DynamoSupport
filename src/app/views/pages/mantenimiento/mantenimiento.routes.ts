import { Routes } from '@angular/router';
import { EntidadComponent } from './entidad/entidad.component';

export const routes: Routes = [
  {
    path: '', children: [
      { path:'entidad', component: EntidadComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];
