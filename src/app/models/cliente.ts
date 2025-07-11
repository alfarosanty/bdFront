import { Color } from "./color.model";

export class Cliente {
    id?:number;
    razonSocial?:string;
    domicilio?:string;
    localidad?:string;
    provincia?:string;
    telefono?:number;
    condicionFiscal?:CondicionFiscal;
    cuit?:string;

    constructor(){
        this.razonSocial = ''
        this.domicilio =''
        this.localidad = ''
        this.provincia = ''
        this.telefono = 0
        this.condicionFiscal = {codigo: " "}
        this.cuit = ''
    }
    
}

class CondicionFiscal{
    codigo?: string;
    descripcion?: string;
}