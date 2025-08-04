import { animate, state, style, transition, trigger } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, Observable, startWith, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Factura } from 'src/app/models/factura.model';
import { PresupuestoArticulo } from 'src/app/models/presupuesto-articulo.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-consultas-general',
  templateUrl: './consultas-general.component.html',
  styleUrls: ['./consultas-general.component.css'],
  providers: [DecimalPipe],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*', display: 'table-row' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class ConsultasGeneralComponent {


// SORT
private _sort!: MatSort;

// MAPAS
mapaFacturaArticulos ?: Map<string,PresupuestoArticulo[]>;
mapaFacturas?: Map<number,Factura> = new Map();

// LISTAS
clientes?: Cliente[];

// DATOS -----------------------------------
currentCliente?: Cliente;
currentIndex = -1;

// Facturacion
puntoDeVenta?: number = 0;
puntosDeVentasPosibles = [0,1,2,3,4,5,6,7,8,9,10]
tipoFactura?: string|null = '';


//------------------------------------------
//  FILTROS 
menuListItems = [
  { id: 'filtro1', icon: 'receipt', label: 'Factura' },
  { id: 'filtro2', icon: 'assignment', label: 'Presupuesto' },
  { id: 'filtro3', icon: 'assignment_returned', label: 'PedidoProduccion' },
  { id: 'filtro4', icon: 'trending_up', label: 'Ingreso' },
  { id: 'None', icon: 'clear', label: 'Sin filtro' }
];

filtroSeleccionado = 'None';

// FECHAS
readonly range = new FormGroup({
  fechaInicio: new FormControl<Date | null>(this.getPrimerDiaMes()),
  fechaFin: new FormControl<Date | null>(new Date())
});

// MAT TABLE INFO
// FACTURA
facturaColumnsToDisplay: string[] = ['Factura', 'TipoFactura', 'NumeroFactura', 'Cae', 'PuntoDeVenta', 'ImporteBruto', 'Iva'];
facturaArticuloColumnsToDisplay: string[] = ['Articulo', 'Cantidad'];
expandedElement: any | undefined;

dataSourceCodigoFactura = new MatTableDataSource<any>([]);

// NG MODEL
numCliente?: number|null = null;

// FILTROS DE BÚSQUEDA
clienteControl = new FormControl();
filteredClientes: Observable<Cliente[]> = new Observable<Cliente[]>;
clienteOptions: Cliente[] =[];
clienteSeleccionado ='';

get filtroSeleccionadoTexto(): string {
  const item = this.menuListItems.find(i => i.id === this.filtroSeleccionado);
  return item ? item.label : 'Ninguna';
}

  constructor(private clienteService: ClienteService, private facturaService: FacturaService, private cdr: ChangeDetectorRef, private decimalPipe: DecimalPipe){}

  ngOnInit(): void {
    this.listarClientes();
    this.mapaFacturaArticulos=new Map();
  
  
  }


  listarClientes(): void {

    this.currentCliente = {};
    this.currentIndex = -1;
    this.clienteService.getAll().pipe(
      catchError(error => {
        // Manejo del error
        console.error('Ocurrió un error:', error);
        alert('Error al acceder a datos provenientes de la base de datos ');
        return throwError(() => new Error('Hubo un problema al obtener los clientes.'));
      })
    ).subscribe({
      next: (data) => {
        this.clientes = data;
        console.log(data);
        this.filteredClientes = this.clienteControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterClientes(value || ''))
        );

        console.log(this.filteredClientes)
      },
      error: (e) => console.error(e)
      
    });
  }

  private _filterClientes(value: string): Cliente[] {
    const filterValue = value.toLowerCase();
    return this.clientes!.filter(cliente => cliente.razonSocial?.toLowerCase().includes(filterValue))
    .sort((a,b) => a.razonSocial!.localeCompare(b.razonSocial!) );
  }


  setFiltroSeleccionado(id: string) {
    this.filtroSeleccionado = id;
    this.cdr.detectChanges(); // Forzar actualización de vista y @ViewChild
    // ahora el @ViewChild debería estar actualizado
    if (this._sort && this.dataSourceCodigoFactura) {
      this.dataSourceCodigoFactura.sort = this._sort;
    }
    this.dataSourceCodigoFactura.data = [];
    this.range.value.fechaInicio = this.getPrimerDiaMes();
    this.range.value.fechaFin = new Date();
  
  }


  private getPrimerDiaMes(): Date {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1); // Día 1 del mes actual
  }

seleccionarXnumeroCliente() {
   this.currentCliente = this.clientes?.find(cliente=>cliente.id == this.numCliente)

   this.clienteControl.setValue(this.currentCliente?.razonSocial);
  }

 seleccionarCliente(){

  const valor = this.clienteControl.value;
  console.log('Cliente seleccionado:', valor);
  // Acá podés buscar el objeto completo si necesitás más datos
  this.currentCliente = this.clientes?.find(c => c.razonSocial === valor);
  this.numCliente = this.currentCliente?.id
  console.log('Objeto cliente:', this.currentCliente);


 }

 traerFacturas() {
  const fechaInicio = this.range.get('fechaInicio')?.value as Date | null;
  const fechaFin = this.range.get('fechaFin')?.value as Date | null;

  if (!fechaInicio || !fechaFin) {
    alert('Por favor seleccioná ambas fechas');
    return;
  }

  console.log(this.currentCliente)
  const filtros = {
    idCliente: this.currentCliente?.id ?? null,
    tipoFactura: this.tipoFactura ?? null,
    puntoDeVenta: this.puntoDeVenta ?? null,
    fechaInicio: this.formatearFechaParaBack(fechaInicio),
    fechaFin: this.formatearFechaParaBack(fechaFin),
  };

  console.log("Filtros:", filtros)

  this.facturaService.getFacturaXFiltro(filtros).subscribe({
    next: (facturas) => {
      facturas.forEach(factura => {
        this.mapaFacturas?.set(factura.id!, factura)
        console.log('Facturas recibidas:', this.mapaFacturas);
        this.actualizarDataSourceFactura()
      });
    },
    error: (err) => {
      console.error('Error al traer facturas:', err);
    }
  });
}


 formatearFechaParaBack(unaFecha: Date): string {
  return unaFecha.toISOString().substring(0, 10);
}

formatearFechaParaFront(fecha: Date): string {

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

formatearMonto(monto: number | undefined): string {
  if (monto == null) return '';
  // Primero formateás el número con DecimalPipe
  const formateado = this.decimalPipe.transform(monto, '1.0-0') ?? '';
  // Después reemplazás las comas por puntos
  return formateado.replace(/,/g, '.');
}


getArticulosParaArticulo(any:any): any[]{
  return []
}

actualizarDataSourceFactura() {
  if (!this.mapaFacturas) return;

  const data = Array.from(this.mapaFacturas.values()).map(factura => ({
    id: factura.id,
    cliente: factura.cliente,
    fecha: this.formatearFechaParaFront(new Date(factura.fechaFactura!)),
    tipoFactura: factura.tipoFactura,
    numeroFactura: factura.numeroFactura,
    caeNumero: factura.caeNumero,
    puntoDeVenta: factura.puntoDeVenta,
    importeBruto: this.formatearMonto(factura.importeBruto),
    iva: this.formatearMonto(factura.iva),
    articulos: factura.articulos
  }));

  this.dataSourceCodigoFactura.data = data;

  console.log('DataSource actualizado:', this.dataSourceCodigoFactura.data);
}

toggleExpand(element: any) {
  if (this.expandedElement === element) {
    this.expandedElement = undefined;
  } else {
    this.expandedElement = element;
    this.cargarArticulosDeFactura(element.id); // llamar al backend justo cuando se expande
  }
}

cargarArticulosDeFactura(idFactura: number): PresupuestoArticulo[]{
  this.facturaService.getArticulos(idFactura).subscribe({
    next: (articulos) => {

    },
    error: (err) => {
      console.error('Error al traer facturas:', err);
    }
  });
  
  return []
}


}
