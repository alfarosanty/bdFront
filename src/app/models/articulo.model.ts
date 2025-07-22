import { ArticuloPrecio } from "./articulo-precio.model";
import { Color } from "./color.model";
import { Familia } from "./familia.model";
import { Medida } from "./medida.model";

export class Articulo {
    id?:number;
    codigo?:string;
    descripcion?:string;
    color?: Color;
    articuloPrecio?:ArticuloPrecio;
    familia?:Familia;
    subFamilia?:Familia;
    medida?:Medida;
    idFabricante?: number;
    nuevo?: Boolean;
    habilitado?: Boolean;
    stock?: number

}
