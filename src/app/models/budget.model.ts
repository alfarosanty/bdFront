import { Articulo } from "./articulo.model";
import { Cliente } from "./cliente";

export class Budget {
    cliente?:Cliente;
    fecha?:Date;
    articulos?:Articulo[];

}
