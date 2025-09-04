import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, throwError } from 'rxjs';
import { EstadoPedidoProduccion } from 'src/app/models/estado-presupuesto.model';
import { Ingreso } from 'src/app/models/ingreso.model';
import { PedidoProduccion } from 'src/app/models/pedido-produccion.model';
import { PresupuestoArticulo } from 'src/app/models/presupuesto-articulo.model';
import { Presupuesto } from 'src/app/models/presupuesto.model';
import { Taller } from 'src/app/models/taller.model';
import { PresupuestoService } from 'src/app/services/budget.service';
import { IngresoService } from 'src/app/services/ingreso.service';
import { OrdenProduccionService } from 'src/app/services/orden-produccion.service';
import { TallerService } from 'src/app/services/taller.service';

@Component({
  selector: 'app-eliminaciones',
  templateUrl: './eliminaciones.component.html',
  styleUrls: ['./eliminaciones.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class EliminacionesComponent {

// NGMODELS
currentTaller?: Taller|null=null;
tipoEliminacion: 'PedidoProduccion' | 'Ingreso' | null = null;


// LISTAS
pedidosProduccionXTaller: PedidoProduccion[] = [];
pedidosProdXTallerFiltrados: PedidoProduccion[] = [];
ingresosXTaller: Ingreso[] = [];
ingresosXTallerFiltrados: Ingreso[] = [];
talleres?: Taller[];
estadosPedidoProduccion: EstadoPedidoProduccion[] = [];


//MAPAS
presupuestosMap: Map<number, Presupuesto> = new Map();
mapaPresupuestoArticulos ?: Map<string,PresupuestoArticulo[]>;



//FILTROS
filtroEstadoPedido?:EstadoPedidoProduccion|null
fechaInicio?: Date;
fechaFin?: Date;

//FLAGS
mostrarConfirmacionPDF = false;


// MAT TABLE PP
columnsToDisplay = ['Pedido', 'Cantidad Total', /*'Cantidad Pendiente',*/'Estado', 'Seleccionar'];
articuloColumnsToDisplay = ['Articulo', 'Descripcion' ,  'Cantidad'/*, 'Cantidad Pendiente'*/];
expandedElement: PresupuestoArticulo | undefined;
dataSourcePedidoProduccion = new MatTableDataSource<PedidoProduccion>();

  constructor(private ingresoService: IngresoService, private ordenProduccionService:OrdenProduccionService, private tallerService:TallerService, private presupuestoService:PresupuestoService, private snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.listarTalleres();
    this.mapaPresupuestoArticulos=new Map();

  this.ordenProduccionService.getEstadosPedidoProduccion().subscribe({
    next: (estados) => {
       this.estadosPedidoProduccion = estados;
    },
    error: (err) => {
      console.error('Error al obtener estados:', err);
    }
  });

  this.fechaFin = new Date();
  this.fechaInicio = new Date();
  this.fechaInicio.setDate(this.fechaFin.getDate() - 7);
  }

  listarTalleres(): void {

    this.currentTaller = {};
    this.tallerService.getAll().pipe(
      catchError(error => {
        // Manejo del error
        console.error('Ocurrió un error:', error);
        alert('Error al acceder a datos provenientes de la base de datos ');
        return throwError(() => new Error('Hubo un problema al obtener los clientes.'));
      })
    ).subscribe({
      next: (data) => {
        this.talleres = data;
      },
      error: (e) => console.error(e)
      
    });
  }


  seleccionarTaller(): void {
    if (this.currentTaller) {
      console.log(this.currentTaller);
      this.buscarOrdenXTaller();
    }
  }

  buscarOrdenXTaller() {
    // Revisar si hay taller y su ID
    if (!this.currentTaller?.id) {
      console.log("Debe seleccionar un Taller válido");
      return;
    }
  
    const tallerId = this.currentTaller.id;
  
    if (this.tipoEliminacion === 'PedidoProduccion') {
      this.ordenProduccionService.getByTaller(tallerId).subscribe({
        next: (data) => {
          this.pedidosProduccionXTaller = data;
  
          // Ordenar por fecha
          this.pedidosProdXTallerFiltrados = data.sort(
            (a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime()
          );
  
          this.dataSourcePedidoProduccion.data = this.pedidosProdXTallerFiltrados;
  
          // Agregar cliente a cada pedido
          this.pedidosProdXTallerFiltrados.forEach(pedidoProduccion =>
            this.agregarClienteAMapa(pedidoProduccion)
          );
  
          // Aplicar filtros
          this.aplicarFiltros(data);
        },
        error: (e) => console.error(e)
      });
  
    } else if (this.tipoEliminacion === 'Ingreso') {
      this.ingresoService.getByTaller(tallerId).subscribe({
        next: (data) => {
          console.log('Los ingresos son: ', data);
        },
        error: (e) => console.error(e)
      });
  
    } else {
      console.log("Tipo de eliminación no válido");
    }
  }
  

  aplicarFiltros(listaAFiltrar: PedidoProduccion[]) {
    const primerFiltroAplicado = this.filtrarPedidosProduccionXEstado(listaAFiltrar);
    const segundoFiltroAplicado = this.filtrarPedidosProduccionXRangoFechas(primerFiltroAplicado);
    this.dataSourcePedidoProduccion.data = segundoFiltroAplicado;
    console.log("DATOS A MOSTRAR", this.dataSourcePedidoProduccion.data)
    
  }

  filtrarPedidosProduccionXEstado(listaAFiltrar:PedidoProduccion[]):PedidoProduccion[] {
    let listaFiltrada
    if (this.filtroEstadoPedido) {
      listaFiltrada = listaAFiltrar
        .filter(pedido => pedido.idEstadoPedidoProduccion == this.filtroEstadoPedido?.id)
        .sort((a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime());
    } else {
      listaFiltrada = [...this.pedidosProduccionXTaller]; // sin filtrar
    }
  
    return listaFiltrada;
  }
  
  
  filtrarPedidosProduccionXRangoFechas(listaPedidosProduccion: PedidoProduccion[]): PedidoProduccion[] {
    console.log("DEBERÍA ESTAR FILTRANDO POR FECHAS");
  
    if (this.fechaInicio && this.fechaFin) {
      const pedidosFiltradosEntreFechas = listaPedidosProduccion.filter(pedidoProduccion =>
        this.estaEntreFechas(this.fechaInicio, this.fechaFin, pedidoProduccion.fecha)
      );
      return pedidosFiltradosEntreFechas;
    }
  
    // Si no hay fechas para filtrar, devolvemos la lista sin modificar
    return listaPedidosProduccion;
  }

  formatearFecha(fecha: any): string {
    const fechaObj = new Date(fecha);
    return isNaN(fechaObj.getTime()) ? 'Fecha inválida' : `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
  }

  estaEntreFechas(fechaInicio: any, fechaFin: any, fechaEvaluar: any): boolean {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const evaluar = new Date(fechaEvaluar);
    console.log(evaluar);
    // Si alguna fecha es inválida, por seguridad devuelvo false
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime()) || isNaN(evaluar.getTime())) {
      return false;
    }
  
    return evaluar >= inicio && evaluar <= fin;
  }

  agregarClienteAMapa(pedidoProduccion:PedidoProduccion){

    if(pedidoProduccion.idPresupuesto){this.agregarPresupuestoAMap(pedidoProduccion.idPresupuesto)}


  }

  agregarPresupuestoAMap(id: number) {
    this.presupuestoService.get(id).subscribe(
      (presupuesto) => {
        this.presupuestosMap.set(id, presupuesto);
        console.log(this.presupuestosMap)
      },
      (error) => {
        console.error('Error al obtener presupuesto:', error);
      }
    );

  }

  drop(event: CdkDragDrop<PedidoProduccion[]>) {
    console.log("movemos de", event.previousIndex, "a", event.currentIndex);
  
    if (event.previousIndex === event.currentIndex) {
      console.log("No se movió de lugar");
      return;
    }
  
    const data = this.dataSourcePedidoProduccion.data;
    console.log(data)
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.dataSourcePedidoProduccion.data = data;
  }

  sumatoriaCantidadTotal(pedido: PedidoProduccion): number|undefined {
    return pedido.articulos?.reduce((total, articulo) => total + articulo.cantidad!, 0);
  }

  sumatoriaCantidadPendienteTotal(pedido: PedidoProduccion): number|undefined {
    return pedido.articulos?.reduce((total, articulo) => total + articulo.cantidadPendiente!, 0);
  }  

  mostrarEstado(pedidoProduccion: PedidoProduccion): string{
    const idEstadoPedidoProduccion = pedidoProduccion.idEstadoPedidoProduccion
    const estadoPedidoProduccion = this.estadosPedidoProduccion.find(estado=>estado.id===idEstadoPedidoProduccion)

    return (estadoPedidoProduccion?.descripcion || 'no hay estado')
  }
 

  mostrarOpciones() {
  
    if (this.cantidadPedidosABorrar() < 1) {
      alert("Debe seleccionar un pedido producción para continuar");
      return;
    }
  
    // Si pasa ambas validaciones:
    this.borrarPedidosProduccion();
    this.mostrarConfirmacionPDF = true;
  }

  cantidadPedidosABorrar(): number {
    console.log("LOS PEDIDOS QUE HAY", this.pedidosProdXTallerFiltrados)
    return this.pedidosProduccionXTaller.filter(pedido => pedido.seleccionadoEliminar).length;

  }

  borrarPedidosProduccion() {
    // Filtrar los pedidos seleccionados
    const listaPedidosAModificar = this.pedidosProdXTallerFiltrados.filter(pedido => pedido.seleccionadoEliminar);
  
    if (listaPedidosAModificar.length === 0) {
      this.mostrarError("No se seleccionó ningún pedido para eliminar.");
      return;
    }
  
    // Mapear a formato que espera el backend
    const pedidosOutputDTO = listaPedidosAModificar.map(pedido => pedido.id!);
  
    // Llamar al servicio y suscribirse
    this.ordenProduccionService.eliminarPedidosProduccion(pedidosOutputDTO).subscribe({
      next: (idsEliminados: number[]) => {
        if (!idsEliminados || idsEliminados.length === 0) {
          this.mostrarError("No se eliminaron pedidos. Verifique que los IDs existan.");
          return;
        }
  
        // Actualizar la vista quitando los pedidos eliminados
        this.pedidosProdXTallerFiltrados = this.pedidosProdXTallerFiltrados.filter(
          pedido => !idsEliminados.includes(pedido.id!)
        );
  
        setTimeout(() => {window.location.reload();}, 5000);
      },
      error: (err) => {
        console.error("Error al eliminar los pedidosProduccion", err);
  
        // Construir mensaje amigable
        let mensaje = "Ocurrió un error al eliminar los pedidosProduccion.";
  
        if (err?.error) {
          if (typeof err.error === 'string') {
            mensaje = err.error;
          } else if (err.error.mensaje) {
            mensaje = err.error.mensaje;
          }
        } else if (err?.message) {
          mensaje = err.message;
        }
  
        // Mostrar en snackBar
        this.snackBar.open(mensaje, "Cerrar", { duration: 5000 });
  
        this.mostrarConfirmacionPDF = false;
      }
    });
  }

// Devuelve un array con los IDs de los pedidos seleccionados
pedidosABorrarIds(): number[] {
  return this.pedidosProduccionXTaller
             .filter(pedido => pedido.seleccionadoEliminar)
             .map(pedido => pedido.id!);
}

// Si querés mostrarlo como string separado por comas
pedidosABorrarIdsString(): string {
  return this.pedidosABorrarIds().join(', ');
}
  

  mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Aceptar', {
      duration: 5000,
      panelClass: ['snackbar-exito'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
  

}
