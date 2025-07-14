import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RespuestaEstadistica } from 'src/app/models/respuesta-estadistica.model';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  providers: [DecimalPipe],

})
export class EstadisticasComponent {
  private _liveAnnouncer = inject(LiveAnnouncer);


@ViewChild('filtro1Tpl', { static: true }) filtro1Tpl!: TemplateRef<any>;
@ViewChild('filtro2Tpl', { static: true }) filtro2Tpl!: TemplateRef<any>;
private _sort!: MatSort;

@ViewChild(MatSort)
set sort(sort: MatSort) {
  if (sort) {this._sort = sort;if (this.dataSourceCodigo) {this.dataSourceCodigo.sort = this._sort;}}}
  get sort(): MatSort {
  return this._sort;
}


menuListItems = [
  { id: 'filtro1', icon: 'monetization_on', label: 'Facturación x Cliente' },
  { id: 'filtro2', icon: 'bar_chart', label: 'Productos vendidos' },
  { id: 'None', icon: 'clear', label: 'Sin filtro' }
];

templateMap: Record<string, TemplateRef<any>> = {};

// HTML GNMODEL
filtroSeleccionado = 'None';
currentCliente = ''

// MAT TABLE INFO
displayedFacturacionXClienteColumns: string[] = ['Cliente', 'Monto', 'Cantidad'];
dataSourceCodigo = new MatTableDataSource<RespuestaEstadistica>([]);




constructor(private facturacionService: FacturaService, private cdr: ChangeDetectorRef, private decimalPipe: DecimalPipe){}

ngOnInit() {
  // El mapa se puede inicializar acá si los templates ya están definidos
  this.templateMap = {
    filtro1: this.filtro1Tpl,
    filtro2: this.filtro2Tpl
  };
}

ngAfterViewInit() {
  this.dataSourceCodigo.sort = this.sort;

  this.dataSourceCodigo.sortingDataAccessor = (item, property) => {
    switch (property) {
      case 'Cliente':
        return item.cliente?.razonSocial?.toLowerCase() || '';
      case 'Monto':
        return item.dinero || 0;
      case 'Cantidad':
        return item.cantidadArticulos || 0;
      default:
        return (item as Record<string, any>)[property];
      }
  };
}


/** Announce the change in sort state for assistive technology. */
announceSortChange(sortState: Sort) {
  // This example uses English messages. If your application supports
  // multiple language, you would internationalize these strings.
  // Furthermore, you can customize the message to add additional
  // details about the values being sorted.
  if (sortState.direction) {
    this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  } else {
    this._liveAnnouncer.announce('Sorting cleared');
  }
}

readonly range = new FormGroup({
  fechaInicio: new FormControl<Date | null>(this.getPrimerDiaMes()),
  fechaFin: new FormControl<Date | null>(new Date())
});

private getPrimerDiaMes(): Date {
  const hoy = new Date();
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1); // Día 1 del mes actual
}


get templateSeleccionado(): TemplateRef<any> | null {
  return this.templateMap[this.filtroSeleccionado] || null;
}

setFiltroSeleccionado(id: string) {
  this.filtroSeleccionado = id;
  this.cdr.detectChanges(); // Forzar actualización de vista y @ViewChild
  // ahora el @ViewChild debería estar actualizado
  if (this._sort && this.dataSourceCodigo) {
    this.dataSourceCodigo.sort = this._sort;
  }
}



get filtroSeleccionadoTexto(): string {
  const item = this.menuListItems.find(i => i.id === this.filtroSeleccionado);
  return item ? item.label : 'Ninguna';
}

formatearFecha(unaFecha: Date): string {
  return unaFecha.toISOString().substring(0, 10);
}

formatearMonto(monto: number | undefined): string {
  if (monto == null) return '';
  // Primero formateás el número con DecimalPipe
  const formateado = this.decimalPipe.transform(monto, '1.0-0') ?? '';
  // Después reemplazás las comas por puntos
  return formateado.replace(/,/g, '.');
}

buscarData(): void {
  switch (this.filtroSeleccionado) {
    case 'filtro1':
      this.facturacionXCliente();
      break;
    case 'filtro2':
      this.productosVendidos();
      break;
    /*case 'filtro3':
      this.buscarNotasDePedido();
      break;*/
    default:
      console.warn('Ningún filtro seleccionado');
      break;
  }
  
}


// Componente
facturacionXCliente() {
  const fechaInicio = this.range.get('fechaInicio')?.value as Date | null;
  const fechaFin = this.range.get('fechaFin')?.value as Date | null;

  if (!fechaInicio || !fechaFin) {
    alert('Por favor seleccioná ambas fechas');
    return;
  }

  const filtros = {
    fechaInicio: this.formatearFecha(fechaInicio),
    fechaFin: this.formatearFecha(fechaFin)
  };

  console.log('Filtros enviados:', filtros);

  this.facturacionService.getFacturacionXCliente(filtros).subscribe({
    next: (data: RespuestaEstadistica[]) => {
      console.log('Respuesta del backend:', data);

     this.actualizarDataSource(data);

      if (this._sort) {
        this.dataSourceCodigo.sort = this._sort;
      }
    },
    error: err => {
      console.error('Error al consultar facturación:', err);
    }
  });
}



productosVendidos(){

}

actualizarDataSource(nuevaData: RespuestaEstadistica[]) {
  this.dataSourceCodigo.data = nuevaData;

  if (this.sort) {
    this.dataSourceCodigo.sort = this.sort;
    console.log('Sort conectado al dataSource:', this.sort);
  } else {
    console.warn('Sort aún no está disponible al actualizar dataSource');
  }
}


}
