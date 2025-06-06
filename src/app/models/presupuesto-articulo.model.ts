import { Articulo } from "./articulo.model";
import { Presupuesto } from "./presupuesto.model";

export class PresupuestoArticulo {
    articulo?:Articulo;
    cantidad?:number
    cantidadOriginal?: number;
    cantidadActual?: number;
    cantidadPendiente?: number;
    codigo?: string;
    precioUnitario?: number;
    descuento?: number;
    descripcion?: string;
    hayStock?: boolean = false;
    presupuesto?: Presupuesto;
}
