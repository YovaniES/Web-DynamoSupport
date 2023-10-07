import { Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { ValidarTokenGuard } from './core/guards/validar-token.guard';
import { BaseComponent } from './layout/base/base.component';

export const routes: Routes = [
  { path: 'auth',
    loadChildren: () => import('./views/auth/auth.routes').then((m) => m.routes),
    canActivate: [NoAuthGuard]
  },
  { path:'error',
    loadChildren: () => import('./views/errors/errors.routes').then((m) => m.routes),
  },
  { path:'', component:BaseComponent,
    children:[
      { path:'home',
        loadChildren: () => import ('./views/pages/home/home.routes').then((m) => m.routes),
        canActivate: [ValidarTokenGuard],
      },
      { path:'gestion',
        loadChildren: () => import ('./views/pages/gestion-personal/personal.routes').then((m)=>m.routes),
        canActivate: [ValidarTokenGuard],
        // data: {rol_menu: [PERMISSION.MENU_PERSONAS, PERMISSION.SUBMENU_PERSONAS]}
      },
      {
        path:'mantenimiento',
        loadChildren: () => import ('./views/pages/mantenimiento/mantenimiento.routes').then((m)=>m.routes),
        canActivate: [ValidarTokenGuard],
        // data: {rol_menu: [PERMISSION.MENU_MANTENIMIENTO]}
      },
      {
        path:'dashboard',
        loadChildren: () => import ('./views/pages/Dashboard/dashboard.routes').then((m)=> m.routes),
      },
      {
        path:'factura',
        loadChildren: () => import ('./views/pages/facturacion/facturacion.routes').then((m)=>m.routes),
        canActivate: [ValidarTokenGuard],
        // data: {rol_menu: [PERMISSION.MENU_FACTURACION]}
      },

      {path: '', redirectTo: 'home', pathMatch: 'full'},
      { path:'**', redirectTo:'/error/404' }
    ]
  },
];
