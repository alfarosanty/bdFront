import { Articulo } from "./articulo.model";
import { Presupuesto } from "./presupuesto.model";

export class PresupuestoArticulo {
    articulo?:Articulo;
    cantidad?:number
    cantidadOriginal?: number;
    cantidadActual?: number;
    cantidadPendiente?: number;
    precioUnitario?: number;
    descuento?: number;
    hayStock: boolean = true;
    presupuesto?: Presupuesto
}
