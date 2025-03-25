import { PresupuestoArticulo } from "./presupuesto-articulo.model"
import { Taller } from "./taller.model"

export class PedidoProduccion {

    id?: Number
    fecha?: Date
    taller?: Taller
    articulos?: PresupuestoArticulo[]
}
