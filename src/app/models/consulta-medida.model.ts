import { Articulo } from "./articulo.model";

export class ConsultaMedida {

    medida?: string;
    cantidad?: number;
}

export class ConsultaTallerCorte{
    
articulo?: Articulo;
cantidadEnCorteUnitario?: number;
cantidadEnTallerUnitario?: number;
stockUnitario?: number;


}

export class ConsultaTallerCortePorCodigo{

codigo?: string;
cantidadEnCorteTotal?: number;
cantidadEnTallerTotal?: number;
stockTotal?: number
consultas?: ConsultaTallerCorte[]

}
