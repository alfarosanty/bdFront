import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RespuestaEstadistica } from 'src/app/models/respuesta-estadistica.model';
import { FacturaService } from 'src/app/services/factura.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
  providers: [DecimalPipe],

})
export class EstadisticasComponent {
  private _liveAnnouncer = inject(LiveAnnouncer);


@ViewChild('filtro1Tpl', { static: true }) filtro1Tpl!: TemplateRef<any>;
//@ViewChild('filtro2Tpl', { static: true }) filtro2Tpl!: TemplateRef<any>;
private _sort!: MatSort;

@ViewChild(MatSort)
set sort(sort: MatSort) {
  if (sort) {this._sort = sort;if (this.dataSourceCodigo) {this.dataSourceCodigo.sort = this._sort;}}}
  get sort(): MatSort {
  return this._sort;
}


menuListItems = [
  { id: 'filtro1', icon: 'monetization_on', label: 'Facturación x Cliente' },
//  { id: 'filtro2', icon: 'bar_chart', label: 'Productos vendidos' },
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
//    filtro2: this.filtro2Tpl
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
  this.dataSourceCodigo.data = [];
  this.range.value.fechaInicio = this.getPrimerDiaMes();
  this.range.value.fechaFin = new Date();

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

generarPDF() {
  const docDefinition: any = {
    content: [
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: `Resumen estadístico de facturación`, style: 'headerBold' },
              { text: `Fecha inicial: ${this.formatearFecha(this.range.value.fechaInicio!)}`, style: 'headerBold' },
              { text: `Fecha final: ${this.formatearFecha(this.range.value.fechaFin!)}`, style: 'headerBold' },
              ]
          },
        ]
      }
    ],
    styles: this.getStyles(),
  };

  const tablaBody = [
    [
      { text: 'Cliente', style: 'tableHeader' },
      { text: 'Monto', style: 'tableHeader' },
      { text: 'Cantidad', style: 'tableHeader' }
    ]
  ];

  this.dataSourceCodigo.data.forEach((item: RespuestaEstadistica) => {
    tablaBody.push([
      { text: item.cliente?.razonSocial || '', style: 'tableCellString' },
      { text: this.formatearMonto(item.dinero) || '0.00', style: 'tableCellString' },
      { text: item.cantidadArticulos?.toString() || '0', style: 'tableCellString' }
    ]);
  });

  docDefinition.content.push({
    table: {
      headerRows: 1,
      widths: ['*', 120, 105],
      body: tablaBody
    },
    layout: 'lightHorizontalLines',
    style: 'table'
  });

  // Generar el PDF
  pdfMake.createPdf(docDefinition).download(`Estadisticas-por-cliente-${this.formatearFecha(new Date())}.pdf`);
}

getStyles() {
return {
headerBold: {
  fontSize: 13,
  bold: true,
  margin: [0, 1, 0, 1]
},
caption: {
  fontSize: 10,
  margin: [0, 1, 0, 1],
  color: 'dark gray'
},
tableHeader: {
  bold: true,
  fontSize: 11,
  color: 'white',
  fillColor: '#4a4a4a',
  alignment: 'center',
  margin: [0, 6, 0, 6]
},
tableCellNumber: {
  fontSize: 10,
  alignment: 'center',
  margin: [0, 5, 0, 5]
},
tableCellString: {
  fontSize: 10,
  alignment: 'center',
  margin: [0, 5, 0, 5]
},
footer: {
  fontSize: 11,
  italics: true,
  alignment: 'center',
  margin: [0, 15, 0, 0]
},
table: {
  margin: [0, 10, 0, 10]
}
};
}

generarExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Estadísticas por Cliente');

  const fechaHoy = new Date();
  const titulo1 = worksheet.addRow([`Estadísticas por cliente - ${this.formatearFecha(fechaHoy)}`]);
  titulo1.font = { size: 16, bold: true };

  worksheet.addRow([]); // Fila vacía

  // Encabezado
  worksheet.addRow(['Cliente', 'Monto', 'Cantidad']);
  const headerRow = worksheet.getRow(3); // Suponiendo que está en la fila 3

  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 14,
      color: { argb: 'FFFFFFFF' }
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4A4A4A' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin' }
    };
  });

  // Datos desde dataSourceCodigo
  this.dataSourceCodigo.data.forEach(item => {
    const row = worksheet.addRow([
      item.cliente?.razonSocial || '',
      this.formatearMonto(item.dinero) || '0.00',
      item.cantidadArticulos?.toString() || '0'
    ]);
    row.font = { size: 13 };
  });

  // Ajustar anchos de columnas
  worksheet.columns.forEach(column => {
    column.width = 25;
  });

  // Descargar Excel
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `Estadisticas-por-cliente-${this.formatearFecha(fechaHoy)}.xlsx`);
  });
}


}