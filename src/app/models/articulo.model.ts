import { Color } from "./color.model";
import { Familia } from "./familia.model";
import { Medida } from "./medida.model";

export class Articulo {
    id?:number;
    codigo?:string;
    descripcion?:string;
    color?: Color;
    precio1?:number;
    familia?:Familia;
    medida?:Medida;
    
}
