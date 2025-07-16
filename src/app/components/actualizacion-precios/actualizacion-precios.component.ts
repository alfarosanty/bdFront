import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ArticuloPrecio } from 'src/app/models/articulo-precio.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-actualizacion-precios',
  templateUrl: './actualizacion-precios.component.html',
  styleUrls: ['./actualizacion-precios.component.css'],
  providers: [DecimalPipe],

})
export class ActualizacionPreciosComponent {
// MAT TABLE HERRAMIENTAS
private _liveAnnouncer = inject(LiveAnnouncer);

// MAT TABLE INFO
dataSourceCodigo : ArticuloPrecio[] = [];
displayedArticuloPrecioColumns: string[] = ['Código', 'Descripción',  'Precio 1', 'Precio 2', 'Precio 3'];

// LISTAS
articulosPrecio: ArticuloPrecio[]=[];

// MAPAS
mapaArticulosPreciosDeBD ?: Map<string, ArticuloPrecio> = new Map()
mapaArticulosPreciosAMostrar ?: Map<string, ArticuloPrecio> = new Map()

//INPUT BUSQUEDA
articuloControl = new FormControl();
options: string[] = [];
filteredArticulos: Observable<string[]>= new Observable<string[]>();
articuloSeleccionado = ''
articuloPrecioSeleccionado: ArticuloPrecio = {codigo: '',descripcion: '',precio1: 0,precio2: 0,precio3: 0};
filterValue = ''

// EXCEL
cargandoExcel = false;
progresoCarga = 0;
cargaCompleta = false;


constructor(private articuloService: ArticuloService, private decimalPipe: DecimalPipe){}


ngOnInit():void{
  this.articuloService.getAllArticuloPrecio().subscribe({
    next: (data) => {
      console.log("esto llega de la bd", data)
      this.articulosPrecio = data.sort((a, b) => a.codigo!.localeCompare(b.codigo!));
      console.log("Estos son los artículos ordenados", this.articulosPrecio)
      this.actualizarMapa(this.mapaArticulosPreciosDeBD!, data)
      this.actualizarMapa(this.mapaArticulosPreciosAMostrar!, data)
      this.actualizarDataSource()
      for (let i = 0; i < this.articulosPrecio?.length; i++) {
        let item = this.articulosPrecio[i];
        this.options.push(item.codigo + ' ' + item.descripcion);
        }
    },
    error: (e) => console.error(e)
  });

  this.filteredArticulos = this.articuloControl.valueChanges.pipe(startWith(''),map(value => this._filter(String(value))));
}

private _filter(value: string): string[] {
  this.filterValue = value.toLowerCase();
  this.articuloControl.value
 return this.options.filter(option => option.toLowerCase().includes(this.filterValue));
}


actualizarDataSource() {
  this.dataSourceCodigo = Array.from(this.mapaArticulosPreciosAMostrar!.values());
}


formatearMonto(monto: number | undefined): string {
  if (monto == null) return '';
  // Primero formateás el número con DecimalPipe
  const formateado = this.decimalPipe.transform(monto, '1.0-0') ?? '';
  // Después reemplazás las comas por puntos
  return formateado.replace(/,/g, '.');
}

actualizarMapa(mapaArticulosPrecio: Map<string, ArticuloPrecio>, articulosPrecio: ArticuloPrecio[]) {
  articulosPrecio.forEach(articuloPrecio => {
    const key = articuloPrecio.codigo;
    if (key) {
      mapaArticulosPrecio.set(key, articuloPrecio);
    }
  });
}

onArticuloSeleccionado(articulo: string) {
  this.articuloSeleccionado = articulo;
  this.articuloPrecioSeleccionado = this.articulosPrecio.filter(a => a.codigo + " " + a.descripcion === this.articuloSeleccionado)[0]!;
  console.log('las opciones de articulos son:', this.articulosPrecio)
  console.log("Articulos de combo", this.filteredArticulos)

}

actualizarArticulo(articuloPrecio: ArticuloPrecio){

}

onArchivoExcelSeleccionado(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) {
    return;
  }
  const archivo = input.files[0];
  this.leerArchivoExcel(archivo);
}

onDrop(event: DragEvent) {
  event.preventDefault();
  if (!event.dataTransfer?.files.length) {
    return;
  }
  const archivo = event.dataTransfer.files[0];
  this.leerArchivoExcel(archivo);
}

onDragOver(event: DragEvent) {
  event.preventDefault(); // necesario para permitir drop
}

leerArchivoExcel(archivo: File) {
  this.cargandoExcel = true;
  this.cargaCompleta = false;
  this.progresoCarga = 0;

  const reader = new FileReader();

  reader.onprogress = (e) => {
    if (e.lengthComputable) {
      this.progresoCarga = Math.round((e.loaded / e.total) * 100);
    }
  };

  reader.onload = (e: any) => {
    this.progresoCarga = 100;
  
    setTimeout(() => {
      this.cargandoExcel = false;
      this.cargaCompleta = true;
  
      /* Procesar el archivo */
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      // Obtener la primera hoja (por ejemplo)
      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];
  
      // Convertir hoja a JSON (array de objetos)
      const datosExcel = XLSX.utils.sheet_to_json(hoja, { defval: '' });
  
      console.log('Datos del Excel:', datosExcel);
  
      // Ahora podés usar datosExcel para lo que necesites
    }, 1000);
  };
  

  reader.onerror = () => {
    this.cargandoExcel = false;
    this.cargaCompleta = false;
    this.progresoCarga = 0;
    alert('Error al leer el archivo Excel');
  };

  reader.readAsArrayBuffer(archivo);
}



}





