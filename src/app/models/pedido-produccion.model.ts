import { PresupuestoArticulo } from "./presupuesto-articulo.model"
import { Taller } from "./taller.model"

export class PedidoProduccion {
    id?: number;
    fecha?: Date;
    taller?: Taller;
    idEstadoPedidoProduccion?: number;
    articulos?: PresupuestoArticulo[];
    idCliente?: number;
    idPresupuesto ?: number;
  
    constructor(fecha: Date, taller: Taller, idEstadoPedidoProduccion: number, articulos: PresupuestoArticulo[], idCliente?: number, idPresupuesto?:number) {
      this.fecha = fecha;
      this.taller = taller;
      this.idEstadoPedidoProduccion = idEstadoPedidoProduccion;
      this.articulos = articulos;
      this.idCliente = idCliente; // No es necesario asignar undefined explícitamente.
      this.idPresupuesto = idPresupuesto;
 
    }
  }
  
