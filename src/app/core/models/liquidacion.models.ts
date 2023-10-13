export interface LiquidacionModel {
  idFactura         : number ;
  periodo?          : Date;
  idProyecto        : number;
  proyecto          : string;
  idTipoLiquidacion : number;
  tipoLiquidacion   : string;
  subServicio       : string;
  idGestor          : number;
  gestor            : string;
  estado            : string;
  ordenCompra       : string;
  codCertificacion  : string;
  factura           : string;
  importe           : any;
  declarado         : any;
  facturado         : any;
  pendiente         : any;
}


export interface FiltroLiqModel {
  idFactura        : string;
  gestorNombre     : string;
  proyecto         : string;
  tipoLiquidacion  : string;
  estadoLiquidacion: string;
  importe          : string;
  periodo          : string;

  periodoActual    : string;
}

export interface RequestLiquidacion {
  periodo        : Date;
  idProyecto     : number;
  idLiquidacion  : number;
  subServicio    : string;
  idGestor       : number;
  venta_declarada: string;
  idEstado       : number;
  idUsuarioCrea  : number;
  fechaCrea      : Date;
  ver_estado     : number;
  id_reg_proy    : number;
}

export interface liqById {

}
