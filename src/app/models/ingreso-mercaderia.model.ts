import { PresupuestoArticulo } from "./presupuesto-articulo.model"
import { Taller } from "./taller.model"

export class IngresoMercaderia {

    id?: Number
    fecha?: Date
    taller?: Taller
    articulos?: PresupuestoArticulo[]
}
