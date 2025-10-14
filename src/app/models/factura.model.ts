import { Cliente } from "./cliente";
import { FacturaArticulo } from "./factura-articulo.model";
import { PresupuestoArticulo } from "./presupuesto-articulo.model";
import { Presupuesto } from "./presupuesto.model";

export class Factura {
    id?:number
    fechaFactura?:Date;
    cliente?:Cliente;
    eximirIVA?:Boolean;
    descuentoGeneral?: number;
    articulos?:FacturaArticulo[];
    presupuesto?:Presupuesto | null;
    puntoDeVenta?: number;
    tipoFactura?: string;
    importeBruto?: number;
    importeNeto?: number;
    iva?: number;
    numeroFactura?: number;
    caeNumero?: number;

    constructor() {
        this.fechaFactura = new Date();
        this.cliente = new Cliente();
        this.eximirIVA = false;
        this.descuentoGeneral = 0;
        this.articulos = [];
        this.presupuesto = null;
        this.puntoDeVenta = 0;
        this.tipoFactura = '';
      }
    }
