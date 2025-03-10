import { Articulo } from "./articulo.model";
import { Cliente } from "./cliente";
import { PresupuestoArticulo } from "./presupuesto-articulo.model";

export class Presupuesto {
    id?:Number
    fecha?:Date;
    Cliente?:Cliente;
    EximirIVA?:Boolean;
    Articulos?:PresupuestoArticulo[];
    esPresupuestoExistente= false
}
