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

    constructor(init?: Partial<Presupuesto>) {
        this.id = init?.id;
        this.fecha = init?.fecha ?? new Date();
        this.cliente = init?.cliente;
        this.EximirIVA = init?.EximirIVA ?? false;
        this.estadoPresupuesto = init?.estadoPresupuesto;
        this.articulos = init?.articulos ?? [];
        this.descuentoGeneral = init?.descuentoGeneral ?? 0;
      }
      
}
