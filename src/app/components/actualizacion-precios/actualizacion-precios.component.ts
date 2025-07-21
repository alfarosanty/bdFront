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

// FLAGS
showBackDrop=false;


// LISTAS
articulosPrecio: ArticuloPrecio[]=[];
informacionDeExcel: any[] = [];

// NG MODELS
cantidadArticulosActualizados?: number;
cantidadArticulosCreados?: number;

// MAPAS
mapaArticulosPreciosDeBD ?: Map<string, ArticuloPrecio> = new Map()
mapaArticulosPreciosAMostrar ?: Map<string, ArticuloPrecio> = new Map()
mapaArticulosPreciosAActualizar ?: Map<string, ArticuloPrecio> = new Map()
mapaArticulosPreciosACrear ?: Map<string, ArticuloPrecio> = new Map()


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

actualizarArticulos() {
  const articulosPrecioACrear = Array.from(this.mapaArticulosPreciosACrear?.values() || []);
  const articulosPrecioAActualizar = Array.from(this.mapaArticulosPreciosAActualizar?.values() || []);

  let actualizarOk = false;
  let crearOk = false;

  if (articulosPrecioAActualizar.length > 0) {
    this.articuloService.actualizarArticulosPrecios(articulosPrecioAActualizar).subscribe({
      next: (res) => {
        console.log('Artículos actualizados correctamente', res);
        actualizarOk = true;
        if ((articulosPrecioACrear.length === 0 || crearOk) && actualizarOk) {
          this.showBackDrop = true;
          this.cantidadArticulosActualizados = articulosPrecioAActualizar.length
          setTimeout(() => location.reload(), 3000);
        }
      },
      error: (err) => {
        alert('Error al actualizar artículos: ' + err.message || err);
        console.error('Error al actualizar artículos', err);
      }
    });
  } else {
    actualizarOk = true; // Si no hay para actualizar, consideramos OK
  }

  if (articulosPrecioACrear.length > 0) {
    this.articuloService.crearArticulosPrecios(articulosPrecioACrear).subscribe({
      next: (res) => {
        console.log('Artículos creados correctamente', res);
        crearOk = true;
        if ((articulosPrecioAActualizar.length === 0 || actualizarOk) && crearOk) {
          this.showBackDrop = true;
          this.cantidadArticulosCreados = articulosPrecioACrear.length
          setTimeout(() => location.reload(), 3000);
        }
      },
      error: (err) => {
        alert('Error al crear artículos: ' + err.message || err);
        console.error('Error al crear artículos', err);
      }
    });
  } else {
    crearOk = true; // Si no hay para crear, consideramos OK
  }
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

      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];

      const datosExcel = XLSX.utils.sheet_to_json<any>(hoja, {
        header: ['codigo', 'descripcion', 'precio1', 'precio2', 'precio3'],
        range: 0,
        defval: '',
        raw: true
      });
      
      this.informacionDeExcel = datosExcel; 
      
      console.log('Datos del Excel LIMPIOS:', this.informacionDeExcel);
      this.separarArticulosPreciosNuevosDeModificados()

      // Ahora podés usar datosLimpios para lo que necesites
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


separarArticulosPreciosNuevosDeModificados() {
  const valorErroneo = (codigo: any): boolean => {
    if (codigo == null) return true;
    if (typeof codigo !== 'string') return true;
    const codigoLimpio = codigo.trim().toUpperCase();
    if (
      codigoLimpio === '' ||
      codigoLimpio === 'EMPTY' ||
      codigoLimpio === 'N/A' ||
      codigoLimpio === 'NA' ||
      codigoLimpio === 'NULL' ||
      codigoLimpio === 'UNDEFINED' ||
      codigoLimpio === '-' ||
      codigoLimpio === '--' ||
      codigoLimpio === '?'
    ) return true;
    return false;
  }
  
  this.informacionDeExcel.forEach(articulo => {
    if (valorErroneo(articulo.codigo)) {
      return;
    }
  
    // Crear un objeto ArticuloPrecio tipado y con valores limpios
    const articuloPrecio: ArticuloPrecio = {
      codigo: articulo.codigo,
      descripcion: articulo.descripcion,
      precio1: Number(articulo.precio1) || 0,
      precio2: Number(articulo.precio2) || 0,
      precio3: Number(articulo.precio3) || 0,
    };
  
    if (this.mapaArticulosPreciosDeBD?.has(articuloPrecio.codigo!)) {
      this.mapaArticulosPreciosAActualizar?.set(articuloPrecio.codigo!, articuloPrecio);
    } else {
      this.mapaArticulosPreciosACrear?.set(articuloPrecio.codigo!, articuloPrecio);
    }
  });
  
  console.log('Articulos a actualizar',this.mapaArticulosPreciosAActualizar)
  console.log('Articulos a crear',this.mapaArticulosPreciosACrear)

}



}





