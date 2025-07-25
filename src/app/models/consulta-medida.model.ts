import { Articulo } from "./articulo.model";

export class ConsultaMedida {

    medida?: string;
    cantidad?: number;
}

export class ConsultaTallerCorte{
    
articulo?: Articulo;
cantidadEnCorte?: number;
cantidadEnTaller?: number;

}

export class ConsultaTallerCortePorCodigo{

codigo?: string;
cantidadEnCorteTotal?: number;
cantidadEnTallerTotal?: number;
consultas?: ConsultaTallerCorte[]

}
