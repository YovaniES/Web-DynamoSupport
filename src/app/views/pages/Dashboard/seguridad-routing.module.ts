import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HarosComponent } from './Haros/haros.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'haros', component: HarosComponent},
      { path: '**', redirectTo: ''}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguridadRoutingModule { }
