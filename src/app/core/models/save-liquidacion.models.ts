export interface SaveLiquidacionModel{
  // IdFactura        : number;
  IdProyecto       : number;
  Sub_servicio     : string;
  IdTipoLiquidacion: number;
  IdGestor         : number;
  Venta_declarada  : string;
  Periodo          : Date;
  Id_reg_proy      : number;
  IdEstado         : number;
  FechaCreacion    : Date
};
