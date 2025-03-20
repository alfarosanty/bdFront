import { Cliente } from "./cliente";
import { PresupuestoArticulo } from "./presupuesto-articulo.model";
import { Presupuesto } from "./presupuesto.model";

export class Factura {
    id?:Number
    Fecha?:Date;
    Cliente?:Cliente;
    EximirIVA?:Boolean;
//    Articulos?:PresupuestoArticulo[];
//    Presupuesto?:Presupuesto;
}
