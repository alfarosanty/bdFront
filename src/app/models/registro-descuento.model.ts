import { Articulo } from "./articulo.model";

export class RegistroDescuento {
    articuloAfectado?: Articulo;
    pendienteAntes?: number;
    descontado?: number;
    pendienteDespues?: number;
}
