import { Cliente } from "./cliente";
import { PresupuestoArticulo } from "./presupuesto-articulo.model";

export class Factura {
    id?:Number
    fecha?:Date;
    cliente?:Cliente;
    EximirIVA?:Boolean;
    Articulos?:PresupuestoArticulo[];
}
