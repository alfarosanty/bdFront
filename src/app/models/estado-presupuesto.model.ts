export class EstadoPresupuesto {
    id?: number;
    codigo?: string;
    descripcion?: string;

    constructor(idAsigar?: number) {
        if (idAsigar) {
            this.id = idAsigar;
        }
    }
}

export class EstadoPedidoProduccion {
    id?: number;
    codigo?: string;
    descripcion?: string;

}