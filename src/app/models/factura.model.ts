import { Cliente } from "./cliente";
import { FacturaArticulo } from "./factura-articulo.model";
import { PresupuestoArticulo } from "./presupuesto-articulo.model";
import { Presupuesto } from "./presupuesto.model";

export class Factura {
    id?:number
    fecha?:Date;
    cliente?:Cliente;
    eximirIVA?:Boolean;
    descuentoGeneral?: number;
    articulos?:FacturaArticulo[];
    presupuesto?:Presupuesto | null;
}
