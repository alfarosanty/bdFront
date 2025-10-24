import { Articulo } from "./articulo.model";

export class ConsultaMedida {

    medida?: string;
    cantidad?: number;
}

export class ConsultaTallerCorte{
    
articulo?: Articulo;
cantidadEnCorteUnitario?: number;
cantidadEnTallerUnitario?: number;
cantidadSeparadoUnitario?: number;
cantidadEstanteriaUnitario?: number;
stockUnitario?: number;


}

export class ConsultaTallerCortePorCodigo{

codigo?: string;
cantidadEnCorteTotal?: number;
cantidadEnTallerTotal?: number;
cantidadSeparadoTotal?: number;
cantidadEstanteriaTotal?: number;
stockTotal?: number
consultas?: ConsultaTallerCorte[]

}
