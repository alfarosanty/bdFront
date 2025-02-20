export class Cliente {
    id?:number;
    razonSocial?:string;
    domicilio?:string;
    localidad?:string;
    provincia?:string;
    telefono?:number;
    condicionFiscal?:CondicionFiscal;
    cuit?:string;
}

class CondicionFiscal{
    codigo?: string;
    descripcion?: string;
}