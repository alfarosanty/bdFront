import { PresupuestoArticulo } from "./presupuesto-articulo.model"
import { Taller } from "./taller.model"

export class PedidoProduccion {

    id?: number
    fecha?: Date
    taller?: Taller
    idEstadoPedidoProduccion ?: number
    articulos?: PresupuestoArticulo[]
}
