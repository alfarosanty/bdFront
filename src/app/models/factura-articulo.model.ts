import { Articulo } from "./articulo.model";
import { Factura } from "./factura.model";

export class FacturaArticulo {
    articulo?:Articulo;
    cantidad?: number;
    precioUnitario?: number;
    descuento?: number;
    factura?: Factura | null;
}
