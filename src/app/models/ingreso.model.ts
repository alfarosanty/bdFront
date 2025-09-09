import { PresupuestoArticulo } from "./presupuesto-articulo.model"
import { Taller } from "./taller.model"

export class Ingreso {

    id?: Number
    fecha?: Date
    taller?: Taller
    articulos?: PresupuestoArticulo[]
    seleccionadoEliminar?: boolean = false;
}
