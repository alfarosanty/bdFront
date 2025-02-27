import { Articulo } from "./articulo.model";
import { Cliente } from "./cliente";
import { PresupuestoArticulo } from "./presupuesto-articulo.model";

export class Presupuesto {
    Fecha?:Date;
    Cliente?:Cliente;
    EximirIVA?:Boolean;
    Articulos?:PresupuestoArticulo[];
}
