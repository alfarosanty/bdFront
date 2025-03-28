import { Articulo } from "./articulo.model";

export class PresupuestoArticulo {
    articulo?:Articulo;
    cantidad?:number
    cantidadOriginal?: number;
    cantidadActual?: number;
    cantidadPendiente?: number;
    precioUnitario?: number;
    descuento?: number;
}
