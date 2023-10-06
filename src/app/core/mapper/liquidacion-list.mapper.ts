import { LiquidacionModel } from '../models/liquidacion.models';

function buscarLiquidacionPorNombre(listLiquidaciones:any[], nombreLiquidacion: string): any{
  let liquidacionEncontrada;
  // console.log('LIQUID', liquidacionEncontrada, nombreLiquidacion);
  // console.log('LIQUID_NOMBRE', nombreLiquidacion); // ACTA

  if (listLiquidaciones && listLiquidaciones.length > 0 && nombreLiquidacion) {
    liquidacionEncontrada =  listLiquidaciones.find(x => x.nombre.toUpperCase() == nombreLiquidacion.toUpperCase()) //id, nombre
  }

  return liquidacionEncontrada? liquidacionEncontrada.id: null;
}

function buscarGestorPorNombre(listGestor:any[], nombreGestor: string): any{
  let gestorEncontrada;

  if (listGestor && listGestor.length > 0 && nombreGestor) {
    gestorEncontrada =  listGestor.find(x => x.nombre.toUpperCase() == nombreGestor.toUpperCase()) //id, nombre
  }
  return gestorEncontrada? gestorEncontrada.id: null;
}

function buscarProyectoPorNombre(listProy:any[], nombreProy: string): any{
  let proyEncontrada;

  if (listProy && listProy.length > 0 && nombreProy) {
    proyEncontrada =  listProy.find(x => x.valor_texto_1.toUpperCase() == nombreProy.toUpperCase()) //id, nombre
  }
  // console.log('PROY', proyEncontrada);
  return proyEncontrada? proyEncontrada.id: null;
}


export function mapearImportLiquidacion(data: any[], listLiquidaciones: any, listGestor: any[], listProy: any[]): LiquidacionModel[] {
  const listaLiquid: LiquidacionModel[] = [];
    data.map(columna => {
    // console.log('LIQ', columna, listLiquidaciones); // {Gestor: "Katia Chavez", Importe: 9925, Periodo:Thu Aug 10 2023 00:00:36 GMT-0500 (hora estándar de Perú) {}, Proyecto: "PETO21", Subservicio: "Soporte Equipo Lesly J.", Tipo: "ACTA"}

    const liquidacionEncontrada = buscarLiquidacionPorNombre(listLiquidaciones, columna.Tipo);
    const gestorEncontrado      = buscarGestorPorNombre(listGestor, columna.Gestor);
    const proyectoEncontrado    = buscarProyectoPorNombre(listProy, columna.Proyecto);

    if (liquidacionEncontrada && gestorEncontrado) {
      const liquidacionModel: LiquidacionModel = {
        IdFactura      : columna.id,
        IdProyecto     : proyectoEncontrado,
        IdLiquidacion  : liquidacionEncontrada,
        SubServicio    : columna.Subservicio,
        IdGestor       : gestorEncontrado,
        Venta_declarada: columna.Importe,
        IdEstado       : 178, // ENVIADO
        Periodo        : new Date(columna.Periodo),
        Id_reg_proy    : (liquidacionEncontrada == 676)? 2 : 1,
        FechaCrea      : new Date() // 2023-09-08 12:00:00
        // FechaCrea      : new Date('2023-09-05 12:00:00')
      };

      listaLiquid.push(liquidacionModel)
    }
  });
  return listaLiquid;
}




// IdFactura      : liq.id,
 // export function mapearImportScore(scoreData: any[], version?: number): LiquidacionModel[] {
//   const listadoDetalle: LiquidacionModel[] = scoreData.map((detalle) => {
//     const liquidacionModel: LiquidacionModel = {
//       // idscore           : idScore,
//       tipo_documento    : detalle.TIPODOCUMENTO,
//       observacion_gestor: '',
//       id_estado         : 1,  // default = 1: Solicitado
//       idrequerimiento   : detalle.REQ,
//       solicitante       : detalle.Analista,
//       financiamiento    : detalle.Financiamiento,
//       nombre_req        : detalle.NombreREQ,
//       // item_version      : version + 1,
//     };
//     return liquidacionModel;
//   });
//   return listadoDetalle;
// }
