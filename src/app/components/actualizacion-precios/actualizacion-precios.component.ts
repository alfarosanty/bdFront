import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ArticuloPrecio } from 'src/app/models/articulo-precio.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import * as XLSX from 'xlsx';
import { forkJoin, of } from 'rxjs';



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
yaProcesado = false;


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
articuloPrecioSeleccionado: ArticuloPrecio|null = {codigo: '',descripcion: '',precio1: 0,precio2: 0,precio3: 0};
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


procesarArticuloSeleccionado(texto: string) {
  if (this.yaProcesado) return;

  this.mapaArticulosPreciosAActualizar?.clear()
  this.mapaArticulosPreciosACrear?.clear()

  this.yaProcesado = true;

  if (!texto) {
    this.articuloPrecioSeleccionado = null;
    this.articuloSeleccionado = '';
    this.yaProcesado = false;
    return;
  }

  const articuloExistente = this.articulosPrecio.find(
    a => `${a.codigo} ${a.descripcion}` === texto
  );

  if (articuloExistente) {
    this.articuloPrecioSeleccionado = articuloExistente;
    this.articuloSeleccionado = `${articuloExistente.codigo} ${articuloExistente.descripcion}`;
  } else {
    this.articuloPrecioSeleccionado = {
      codigo: texto,
      descripcion: 'DESCRIBA EL ARTÍCULO',
      precio1: 0,
      precio2: 0,
      precio3: 0
    };
    this.articuloSeleccionado = texto;
  }

  if(articuloExistente){
    this.mapaArticulosPreciosAActualizar?.set(this.articuloPrecioSeleccionado.codigo!, this.articuloPrecioSeleccionado)
  }else{
    this.mapaArticulosPreciosACrear?.set(this.articuloPrecioSeleccionado.codigo!,  this.articuloPrecioSeleccionado)
  }

  setTimeout(() => {
    this.yaProcesado = false;
  }, 10);
}

mostrarMapas(){
  console.log("mapa de actualización", this.mapaArticulosPreciosAActualizar)
  console.log("mapa de creación", this.mapaArticulosPreciosACrear)
}


actualizarArticulos() {
  const articulosPrecioACrear = Array.from(this.mapaArticulosPreciosACrear?.values() || []);
  const articulosPrecioAActualizar = Array.from(this.mapaArticulosPreciosAActualizar?.values() || []);

  const obsActualizar = articulosPrecioAActualizar.length > 0 
    ? this.articuloService.actualizarArticulosPrecios(articulosPrecioAActualizar) 
    : of(null);

  const obsCrear = articulosPrecioACrear.length > 0 
    ? this.articuloService.crearArticulosPrecios(articulosPrecioACrear) 
    : of(null);

  forkJoin([obsActualizar, obsCrear]).subscribe({
    next: ([resActualizar, resCrear]) => {
      if (resActualizar) {
        console.log('Artículos actualizados correctamente', resActualizar);
        this.cantidadArticulosActualizados = articulosPrecioAActualizar.length;
      }
      if (resCrear) {
        console.log('Artículos creados correctamente', resCrear);
        this.cantidadArticulosCreados = articulosPrecioACrear.length;
      }
      this.showBackDrop = true;
      setTimeout(() => location.reload(), 3000);
    },
    error: (err) => {
      alert('Error en operación de artículos: ' + (err.message || err));
      console.error('Error en operación de artículos', err);
    }
  });
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





