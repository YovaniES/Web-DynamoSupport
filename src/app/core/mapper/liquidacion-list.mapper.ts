import { LiquidacionModel } from '../models/liquidacion.models';
import { SaveLiquidacionModel } from '../models/save-liquidacion.models';

function buscarTipoLiquidacionPorNombre(listLiquidaciones:any[], nombreLiquidacion: string): any{
  let liquidacionEncontrada;
  console.log('LIQUID', liquidacionEncontrada, nombreLiquidacion);
  // console.log('LIQUID_NOMBRE', nombreLiquidacion); // ACTA

  if (listLiquidaciones && listLiquidaciones.length > 0 && nombreLiquidacion) {
    liquidacionEncontrada =  listLiquidaciones.find(x => x.tipoLiquidacion.toUpperCase() == nombreLiquidacion.toUpperCase()) //id, nombre
  }

  return liquidacionEncontrada? liquidacionEncontrada.id: null;
}

function buscarGestorPorNombre(listGestor:any[], nombreGestor: string): any{
  let gestorEncontrada;

  if (listGestor && listGestor.length > 0 && nombreGestor) {
    gestorEncontrada =  listGestor.find(x => x.nombre_apellido.toUpperCase() == nombreGestor.toUpperCase()) //id, nombre
  }
  console.log('GESTOR_IMPORTADO', gestorEncontrada);

  return gestorEncontrada? gestorEncontrada.id: null;
}

function buscarProyectoPorNombre(listProy:any[], nombreProy: string): any{
  let proyEncontrada;

  if (listProy && listProy.length > 0 && nombreProy) {
    proyEncontrada =  listProy.find(x => x.nombre.toUpperCase() == nombreProy.toUpperCase()) //id, nombre
  }
  console.log('PROYECTO_IMPORTADO', proyEncontrada);
  return proyEncontrada? proyEncontrada.id: null;
}

export function mapearImportLiquidacion(data: any[], listLiquidaciones: any, listGestor: any[], listProy: any[]): SaveLiquidacionModel[] {
  const listaLiquid: SaveLiquidacionModel[] = [];
    data.map(columna => {
    console.log('LIQ-COLUM', columna, listLiquidaciones); // DATA EXCELL: {Gestor: "Katia Chavez", Importe: 9925, Periodo:Thu Aug 10 2023 00:00:36 GMT-0500 (hora estándar de Perú) {}, Proyecto: "PETO21", Subservicio: "Soporte Equipo Lesly J.", Tipo: "ACTA"}

    const liquidacionEncontrada = buscarTipoLiquidacionPorNombre(listLiquidaciones, columna.Tipo);
    const gestorEncontrado      = buscarGestorPorNombre(listGestor, columna.Gestor);
    const proyectoEncontrado    = buscarProyectoPorNombre(listProy, columna.Proyecto);

    if (liquidacionEncontrada && gestorEncontrado) {
      const liquidacionModel: SaveLiquidacionModel = {
        // IdFactura        : columna.id,
        IdProyecto       : proyectoEncontrado,
        // IdTipoLiquidacion: columna.Tipo,
        IdTipoLiquidacion: liquidacionEncontrada,
        Sub_servicio     : columna.Subservicio,
        IdGestor         : gestorEncontrado,
        Venta_declarada  : columna.Importe,
        IdEstado         : 178, // ENVIADO
        Periodo          : new Date(columna.Periodo),
        Id_reg_proy      : (liquidacionEncontrada == 676)? 2 : 1,
        FechaCreacion    : new Date() // 2023-09-08 12:00:00
      };

      listaLiquid.push(liquidacionModel)
    }
  });
  return listaLiquid;
}
