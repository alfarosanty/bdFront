import { Articulo } from "./articulo.model";

export class RegistroDescuento {
    articuloAfectado?: Articulo;
    cantidadPedidaOriginal?: number;
    pendienteAntes?: number;
    descontado?: number;
    pendienteDespues?: number;
    idPedidoProduccion?: Number;
    hayStock?: boolean;
}
