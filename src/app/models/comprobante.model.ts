import { Vendedor } from "./vendedor.model";

export class Comprobante {
    lista1?:Boolean;
    lista2?:Boolean;
    fecha?:Date;
    descuento?:Number;
    vendedor?:Vendedor;
    iva?:Boolean;
}
