import { Routes } from '@angular/router';
import { HarosComponent } from './Haros/haros.component';

export const routes: Routes = [
  {
    path: '', children: [
      { path: 'haros', component: HarosComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];
