import { Articulo } from "./articulo.model";
import { Cliente } from "./cliente";
import { PresupuestoArticulo } from "./presupuesto-articulo.model";

export class Presupuesto {
    fecha?:Date;
    cliente?:Cliente;
    EximirIVA?:Boolean;
    articulos?:PresupuestoArticulo[];
}
