import { Cliente } from "./cliente";
import { FacturaArticulo } from "./factura-articulo.model";
import { PresupuestoArticulo } from "./presupuesto-articulo.model";
import { Presupuesto } from "./presupuesto.model";

export class Factura {
    id?:number
    Fecha?:Date;
    Cliente?:Cliente;
    EximirIVA?:Boolean;
    Articulos?:FacturaArticulo[];
    Presupuesto?:Presupuesto | null;
}
