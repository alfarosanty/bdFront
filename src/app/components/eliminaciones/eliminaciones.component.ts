import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { firstValueFrom, mergeMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, throwError } from 'rxjs';
import { EstadoPedidoProduccion } from 'src/app/models/estado-presupuesto.model';
import { Ingreso } from 'src/app/models/ingreso.model';
import { PedidoProduccionIngresoDetalle } from 'src/app/models/pedido-produccion-ingreso-detalle.model';
import { PedidoProduccion } from 'src/app/models/pedido-produccion.model';
import { PresupuestoArticulo } from 'src/app/models/presupuesto-articulo.model';
import { Presupuesto } from 'src/app/models/presupuesto.model';
import { Taller } from 'src/app/models/taller.model';
import { PresupuestoService } from 'src/app/services/budget.service';
import { IngresoService } from 'src/app/services/ingreso.service';
import { OrdenProduccionService } from 'src/app/services/orden-produccion.service';
import { TallerService } from 'src/app/services/taller.service';
import { forkJoin, Observable, of } from 'rxjs';


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
detallesDeIngresoPP: PedidoProduccionIngresoDetalle[] = [];
pedidosProduccionAModificar: PedidoProduccion[] = []
presupuestosAModificar: Presupuesto[] = []



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
columnsToDisplay: string[] = [];
articuloColumnsToDisplay = ['Articulo', 'Descripcion' ,  'Cantidad'/*, 'Cantidad Pendiente'*/];
expandedElement: PresupuestoArticulo | undefined;
dataSource = new MatTableDataSource<PedidoProduccion|Ingreso>();

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

  definirColumnas() {
    if (this.tipoEliminacion === 'PedidoProduccion') {
      this.columnsToDisplay = ['Pedido', 'Cantidad Total', 'Estado', 'Seleccionar'];
    } else if (this.tipoEliminacion === 'Ingreso') {
      this.columnsToDisplay = ['Ingreso', 'Cantidad Total', 'Seleccionar']; // sin Estado
    } else {
      this.columnsToDisplay = [];
    }
  }


  seleccionarTaller(): void {
    if (this.currentTaller) {
      console.log(this.currentTaller);
      this.buscarOrdenXTaller();
    }
  }

  buscarOrdenXTaller() {
    this.definirColumnas();
    this.dataSource.data = []; // limpiar tabla
  
    if (!this.currentTaller?.id) {
      console.log("Debe seleccionar un Taller válido");
      return;
    }
  
    const tallerId = this.currentTaller.id;
  
    if (this.tipoEliminacion === 'PedidoProduccion') {
      this.ordenProduccionService.getByTaller(tallerId).subscribe({
        next: (data) => {
          this.pedidosProduccionXTaller = data;
  
          // Ordenar por fecha sin mutar original
          this.pedidosProdXTallerFiltrados = [...data].sort(
            (a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime()
          );
  
          this.dataSource.data = this.pedidosProdXTallerFiltrados.sort((a, b) => a.id! - b.id!);
  
          // Agregar cliente
          this.pedidosProdXTallerFiltrados.forEach(p =>
            this.agregarClienteAMapa(p)
          );
  
          // Aplicar filtros
          this.aplicarFiltros(this.pedidosProdXTallerFiltrados);
        },
        error: (e) => console.error(e)
      });
  
    } else if (this.tipoEliminacion === 'Ingreso') {
      this.ingresoService.getByTaller(tallerId).subscribe({
        next: (data) => {
          this.ingresosXTaller = data;
  
          this.ingresosXTallerFiltrados = [...data].sort(
            (a, b) => new Date(a.fecha!).getTime() - new Date(b.fecha!).getTime()
          );
  
          this.dataSource.data = this.ingresosXTallerFiltrados.sort((a, b) => Number(a.id)! - Number(b.id)!);
  
          // Aplicar filtros
          this.aplicarFiltros(this.ingresosXTallerFiltrados);
        },
        error: (e) => console.error(e)
      });
    } else {
    }
  }
    
  aplicarFiltros(listaAFiltrar: PedidoProduccion[]|Ingreso[]) {
    if(this.tipoEliminacion=='PedidoProduccion'){
    const primerFiltroAplicado = this.filtrarPedidosProduccionXEstado(listaAFiltrar as PedidoProduccion[]);
    const segundoFiltroAplicado = this.filtrarPedidosProduccionXRangoFechas(primerFiltroAplicado);
    this.dataSource.data = segundoFiltroAplicado;
  } else if(this.tipoEliminacion=='Ingreso'){
    const primerFiltroAplicado = this.filtrarPedidosProduccionXRangoFechas(listaAFiltrar);
    this.dataSource.data = primerFiltroAplicado;
  }
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
  
  
  filtrarPedidosProduccionXRangoFechas(listaPedidosProduccion: PedidoProduccion[]|Ingreso[]): PedidoProduccion[]|Ingreso[] {
  
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
      },
      (error) => {
        console.error('Error al obtener presupuesto:', error);
      }
    );

  }

  drop(event: CdkDragDrop<PedidoProduccion[]>) {
  
    if (event.previousIndex === event.currentIndex) {
      return;
    }
  
    const data = this.dataSource.data;
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.dataSource.data = data;
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
    if(this.tipoEliminacion=='PedidoProduccion'){

    
  
    if (this.cantidadPedidosABorrar() < 1) {
      this.mostrarError("Debe seleccionar un pedido producción para continuar");
      return;
    }
  
    // Si pasa ambas validaciones:
    this.borrarPedidosProduccion();
  } else  if(this.tipoEliminacion=='Ingreso'){

    if (this.cantidadIngresosABorrar() < 1) {
      this.mostrarError("Debe seleccionar un ingreso para continuar");
      return;
    }
  
    this.actualizarDocumentacion();
    this.borrarIngresos();

  }
    this.mostrarConfirmacionPDF = true;

    setTimeout(() => {window.location.reload();}, 10000);
  }

  cantidadPedidosABorrar(): number {
    return this.pedidosProduccionXTaller.filter(pedido => pedido.seleccionadoEliminar).length;

  }

  cantidadIngresosABorrar(): number {
    return this.ingresosXTallerFiltrados.filter(ingreso => ingreso.seleccionadoEliminar).length;

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

  actualizarDocumentacion(): void {
    const ingresosABorrar = this.ingresosXTaller.filter(ingreso => ingreso.seleccionadoEliminar);
  
    this.obtenerDetallesDeIngresos(ingresosABorrar)

  }
  
  

  encontrarPedidoProduccionDe(idPedidoProduccion: number): Observable<PedidoProduccion> {
    const pedidoProduccion = this.pedidosProduccionXTaller.find(pedido => pedido.id === idPedidoProduccion);
  
    if (pedidoProduccion) {
      // Si ya existe en memoria, devolvemos un observable que emite el pedido
      return of(pedidoProduccion);
    } else {
      // Si no, lo traemos de la API
      return this.ordenProduccionService.get(idPedidoProduccion);
    }
  }
  

  obtenerDetallesDeIngresos(ingresosABorrar: Ingreso[]){

    this.detallesDeIngresoPP = []

    ingresosABorrar.forEach(detalle=>{
      this.ingresoService.getDetallePPI(detalle).subscribe({
        next:(data) => {
          this.detallesDeIngresoPP = this.detallesDeIngresoPP.concat(data);
          if(this.detallesDeIngresoPP.length>0)
          this.obtenerDocumentosAModificar()

        },
        error: (err) => {
          console.error('Error al obtener estados:', err);
        }
      })

    })


  }

  obtenerDocumentosAModificar(){


    const idsPedidosProduccion = Array.from(
      new Set(this.detallesDeIngresoPP.map(detalle => detalle.pedidoProduccion?.id!))
    );

    const idsPresupuestos = Array.from(
      new Set(this.detallesDeIngresoPP.map(detalle => detalle.presupuesto?.id!))
    ).filter(id=>id!=null);

    if(idsPedidosProduccion.length>0){
      this.ordenProduccionService.getByIds(idsPedidosProduccion).subscribe({
        next:(data) => {
          this.pedidosProduccionAModificar = data

          this.restaurarCantidades(this.detallesDeIngresoPP, this.pedidosProduccionAModificar, 'PP');

            this.pedidosProduccionAModificar.forEach(pedido=>{
              this.ordenProduccionService.actualizar(pedido).subscribe({
                next:(data)=>{
                }
              })
            })
        }
      })
    }

    if(idsPresupuestos.length>0){
      this.presupuestoService.getByIds(idsPresupuestos).subscribe({
        next:(data) => {
          this.presupuestosAModificar = data

          this.restaurarCantidades(this.detallesDeIngresoPP, this.presupuestosAModificar, 'P');

          this.presupuestosAModificar.forEach(presupuesto=>{
            this.ordenProduccionService.actualizar(presupuesto).subscribe({
              next:(data)=>{
              }
            })
          })
  
        }
      })
    }

  }

  borrarIngresos(){
    const ingresosABorrar = this.ingresosXTaller.filter(ingreso => ingreso.seleccionadoEliminar);
    let idsEliminados: number[] = []

    ingresosABorrar.forEach(ingreso => {
        this.ingresoService.borrar(ingreso).subscribe({
          next:(data) => {
            idsEliminados.push(data as number)
          }
        })
    })

  }
  
// Devuelve un array con los IDs de los pedidos seleccionados
pedidosABorrarIds(): number[] {
  return this.pedidosProduccionXTaller
             .filter(pedido => pedido.seleccionadoEliminar)
             .map(pedido => pedido.id!);
}

ingresosABorrarIds(): Number[] {
  return this.ingresosXTaller
             .filter(ingreso => ingreso.seleccionadoEliminar)
             .map(ingreso => ingreso.id!);
}

// Si querés mostrarlo como string separado por comas
pedidosABorrarIdsString(): string {
  return this.pedidosABorrarIds().join(', ');
}

ingresosABorrarIdsString(): string {
  return this.pedidosABorrarIds().join(', ');
}


restaurarCantidades(
  detalles: PedidoProduccionIngresoDetalle[],
  docARestaurar: (PedidoProduccion | Presupuesto)[],
  tipo: string
) {
  detalles.forEach((detalle, index) => {
    console.log(`Procesando detalle #${index}`, detalle.articulo?.codigo, detalle.cantidadDescontada);
  
    let doc: PedidoProduccion | Presupuesto | undefined;
  
    if (tipo === 'PP') {
      doc = docARestaurar.find(d => d.id === detalle.pedidoProduccion?.id) as PedidoProduccion;
    } else if (tipo === 'P') {
      doc = docARestaurar.find(d => d.id === detalle.presupuesto?.id) as Presupuesto;
    }
  
    if (!doc) {
      console.log('Documento no encontrado para detalle', detalle);
      return;
    }
  
    const articulo = doc.articulos?.find(a => a.articulo?.id === detalle.articulo?.id);
    if (!articulo) {
      console.log('Artículo no encontrado en documento', detalle.articulo?.codigo);
      return;
    }
  
    console.log('Articulo a restaurar', articulo.codigo, 'pendiente actual', articulo.cantidadPendiente);
  
    articulo.cantidadPendiente = (articulo.cantidadPendiente || 0) + (detalle.cantidadDescontada || 0);
  
    console.log('Nueva cantidad pendiente', articulo.cantidadPendiente);
  });
  
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
