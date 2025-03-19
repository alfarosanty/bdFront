import { Articulo } from "./articulo.model";

export class PresupuestoArticulo {
    articulo?:Articulo;
    cantidad?: number;
    precioUnitario?: number;
    descuento?: number;
}
