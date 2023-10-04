import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FacturacionRoutingModule } from './facturacion-routing.module';
import { ActualizarLiquidacionComponent } from './liquidacion/actualizar-liquidacion/actualizar-liquidacion.component';
import { CrearLiquidacionComponent } from './liquidacion/crear-liquidacion/crear-liquidacion.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CoreModule } from 'src/app/core/core.module';
import { NgxPaginationModule } from 'ngx-pagination';
// import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgregarVentadeclaradaComponent } from './liquidacion/actualizar-liquidacion/agregar-ventadeclarada/agregar-ventadeclarada.component';
import { LiquidacionComponent } from './liquidacion/liquidacion.component';
import { AgregarCertificacionComponent } from './liquidacion/actualizar-liquidacion/agregar-certificacion/agregar-certificacion.component';
import { ActualizacionMasivaComponent } from './liquidacion/actualizacion-masiva/actualizacion-masiva.component';
import { ModalComentarioComponent } from './liquidacion/modal-comentario/modal-comentario.component';
import { VisorDeclaradaComponent } from './dpf-facturacion/visor-venta-decl/visor-declarada.component';
import { VisorDpfComponent } from './dpf-facturacion/visor-dpf-alo/visor-dpf.component';
import { ModalDpfPendienteComponent } from './dpf-facturacion/visor-dpf-alo/modal-dpf-pendiente/modal-dpf-pendiente.component';

@NgModule({
  declarations: [
    CrearLiquidacionComponent,
    ActualizarLiquidacionComponent,
    AgregarVentadeclaradaComponent,
    LiquidacionComponent,
    AgregarCertificacionComponent,
    ActualizacionMasivaComponent,
    VisorDeclaradaComponent,
    VisorDpfComponent,
    ModalComentarioComponent,
    ModalDpfPendienteComponent,
    ],
  imports: [
    CommonModule,
    FacturacionRoutingModule,
    CoreModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    // ChartsModule,
  ],
  providers: [DatePipe,],
  bootstrap: [LiquidacionComponent]

})
export class FacturacionModule { }
