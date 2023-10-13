export interface SaveLiquidacionModel{
  IdFactura      : number;
  IdProyecto     : number;
  IdLiquidacion  : number;
  SubServicio    : string;
  IdGestor       : number;
  Venta_declarada: string;
  IdEstado       : number;
  Periodo        : Date;
  Id_reg_proy    : number;
  FechaCrea      : Date
};
