import { Articulo } from "./articulo.model";
import { Cliente } from "./cliente";
import { EstadoPresupuesto } from "./estado-presupuesto.model";
import { PresupuestoArticulo } from "./presupuesto-articulo.model";

export class Presupuesto {
    id?:number
    fecha?:Date;
    cliente?:Cliente;
    EximirIVA?:Boolean;
    estadoPresupuesto?: EstadoPresupuesto;
    articulos?:PresupuestoArticulo[];
    descuentoGeneral?: number;
}
