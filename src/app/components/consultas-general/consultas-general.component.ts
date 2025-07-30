import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-consultas-general',
  templateUrl: './consultas-general.component.html',
  styleUrls: ['./consultas-general.component.css'],
  providers: [DecimalPipe],

})
export class ConsultasGeneralComponent {


  // SORT
  private _sort!: MatSort;


  //   FILTROS 

  menuListItems = [
    { id: 'filtro1', icon: 'monetization_on', label: 'Factura' },
    { id: 'filtro2', icon: 'bar_chart', label: 'Presupuesto' },
    { id: 'filtro3', icon: 'bar_chart', label: 'PedidoProduccion' },
    { id: 'filtro4', icon: 'bar_chart', label: 'Ingreso' },
    { id: 'None', icon: 'clear', label: 'Sin filtro' }
  ];

  filtroSeleccionado = 'None';

// FECHAS

readonly range = new FormGroup({
  fechaInicio: new FormControl<Date | null>(this.getPrimerDiaMes()),
  fechaFin: new FormControl<Date | null>(new Date())
});

// MAT TABLE INFO
displayedFacturacionXClienteColumns: string[] = ['Cliente', 'Monto Bruto', 'Cantidad'];
dataSourceCodigo = new MatTableDataSource<number>([]);


get filtroSeleccionadoTexto(): string {
  const item = this.menuListItems.find(i => i.id === this.filtroSeleccionado);
  return item ? item.label : 'Ninguna';
}

  constructor(private facturacionService: FacturaService, private cdr: ChangeDetectorRef, private decimalPipe: DecimalPipe){}




  setFiltroSeleccionado(id: string) {
    this.filtroSeleccionado = id;
    this.cdr.detectChanges(); // Forzar actualización de vista y @ViewChild
    // ahora el @ViewChild debería estar actualizado
    if (this._sort && this.dataSourceCodigo) {
      this.dataSourceCodigo.sort = this._sort;
    }
    this.dataSourceCodigo.data = [];
    this.range.value.fechaInicio = this.getPrimerDiaMes();
    this.range.value.fechaFin = new Date();
  
  }


  private getPrimerDiaMes(): Date {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1); // Día 1 del mes actual
  }

}
