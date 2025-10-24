import { Articulo } from "./articulo.model";
import { Ingreso } from "./ingreso.model";
import { PedidoProduccion } from "./pedido-produccion.model";
import { Presupuesto } from "./presupuesto.model";

export class PedidoProduccionIngresoDetalle {
    pedidoProduccion?: PedidoProduccion;
    ingreso?: Ingreso;
    presupuesto?: Presupuesto;
    articulo?: Articulo;
    cantidadDescontada?: number;
    cantidadPendienteAntes?: number;
    cantidadPendienteDespues?: number;
}
