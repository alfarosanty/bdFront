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
    transporte?:string;

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

export class CondicionFiscal{
    id?: number;
    codigo?: string;
    descripcion?: string;
}