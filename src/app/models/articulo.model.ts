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
    medida?:Medida;
    idFabricante?: number;    

    obtenerCodigo(){
        return this.familia?.codigo + "/" + this.medida?.codigo
    }
}
