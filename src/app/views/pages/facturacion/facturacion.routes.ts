import { Routes } from '@angular/router';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { VisorDeclaradaComponent } from './dpf-facturacion/visor-venta-decl/visor-declarada.component';
import { VisorDpfComponent } from './dpf-facturacion/visor-dpf-alo/visor-dpf.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'liquidacion', component: LiquidacionComponent },
      // { path: 'visoract', component: VisorActComponent },
      // { path: 'visorfact', component: VisorFactComponent },
      // { path: 'visorcierre', component: VisorActByProyComponent },
      { path: 'visordec', component: VisorDeclaradaComponent },
      { path: 'visordpf', component: VisorDpfComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];
