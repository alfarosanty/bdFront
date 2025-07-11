import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { map, Observable, startWith } from 'rxjs';
import { ArticuloPrecio } from 'src/app/models/articulo-precio.model';
import { Articulo } from 'src/app/models/articulo.model';
import { Color } from 'src/app/models/color.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import { ColorService } from 'src/app/services/color.service';


@Component({
  selector: 'app-articulo-configuracion',
  templateUrl: './articulo-configuracion.component.html',
  styleUrls: ['./articulo-configuracion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class ArticuloConfiguracionComponent {

// DATOS DE FOCUS EN HTML
@ViewChild('inputColores') inputColores!: MatSelect;
@ViewChild('inputCantidad') inputCantidad!: ElementRef<HTMLInputElement>;
@ViewChild('inputArticulos') inputArticulos!: ElementRef<HTMLInputElement>;

//NG MODELS
articuloSeleccionado ='';
codigoArticulo = '';


articuloColorIndex: number | null = null;
mostrarColores = false;

//LISTAS
articulos: Articulo[]=[];
articulosPrecio: ArticuloPrecio[]=[];
colores: Color[] = [];
coloresPosibles: Color[]=[];

//MAPAS
mapaArticulosACrear ?: Map<string,Articulo[]> = new Map();

// INPUTS
articuloControl = new FormControl();
filteredArticulos: Observable<string[]>= new Observable<string[]>();
options: string[] = [];
filterValue ='';

// FLAGS
showBackDrop = false

//MAT COMPONENTS
columnsToDisplay = ['Artículo', 'Descripcion'];
articuloColumnsToDisplay = ['Artículo', 'Habilitado'];
expandedElement: any | null;
dataSourceCodigo: any[] = []; // debe contener objetos con: codigo, descripcion





constructor(private articuloService: ArticuloService, private cdr: ChangeDetectorRef, private colorService: ColorService){}


ngOnInit(): void {

  this.articuloService.getAllArticuloPrecio().subscribe({
    next: (data) => {
      this.articulosPrecio = data; 
      //console.log("ARTICULOS DE LA BD", this.articulosPrecio.map(articuloPrecio=>articuloPrecio.codigo))
      for (let i = 0; i < this.articulosPrecio?.length; i++) {
        let item = this.articulosPrecio[i];
        this.options.push(item.codigo + ' ' + item.descripcion);
        //console.log(item);
        }
        //console.log('items options ' +  this.options.length);       
        //console.log(data);
    },
    error: (e) => console.error(e)
  });

  this.colorService.getAll().subscribe({
    next: (data) => {
      this.colores = data;
      console.log(data)
    }
  })

  this.filteredArticulos = this.articuloControl.valueChanges.pipe(startWith(''),map(value => this._filterArticulos(String(value))));


}

private _filterArticulos(value: string): string[] {
  this.filterValue = value.toLowerCase();
 // this.articuloControl.setValue(this.options.filter(option => option.toLowerCase().includes(this.filterValue))[0]);
  this.articuloControl.value
 return this.options.filter(option => option.toLowerCase().includes(this.filterValue));
}


mostrarVariedadColores() {
  console.log(this.articuloSeleccionado)
  this.articulos = [];
  const articuloPrecioDeseado = this.articulosPrecio.filter(articuloPrecio=>articuloPrecio.codigo + " " + articuloPrecio.descripcion ===this.articuloSeleccionado)[0]

  // Verifica si hay un código de artículo
  if (articuloPrecioDeseado) {
    // Separa el código en familia y medida
    if(!articuloPrecioDeseado){alert("El artículo seleccionado no existe")}
    const idArticuloPrecioDeseado = articuloPrecioDeseado.id

    // Llama al servicio para obtener artículos según la familia y medida
    this.articuloService.getByArticuloPrecio(idArticuloPrecioDeseado, false).subscribe({
      next: (data) => {
        this.articulos = data;
        console.log("los articulos son:", this.articulos)
        this.coloresDisponibles();
        this.articulos.sort((a, b) => {
          const descA = a.color?.descripcion?.toLowerCase() || '';
          const descB = b.color?.descripcion?.toLowerCase() || '';
          return descA.localeCompare(descB);
        });

        this.cargarMapa(this.articulos, this.mapaArticulosACrear!)
        

        // Mostrar u ocultar colores según si hay artículos disponibles
        this.mostrarColores = this.articulos.length > 0;

        this.cdr.detectChanges(); // fuerza a Angular a renderizar el mat-select

      setTimeout(() => {
        if (this.inputColores) {
          this.inputColores.focus();
          this.inputColores.open();
        }
      });
      },
      error: (e) => console.error('Error al obtener artículos:', e)
    });

  } else {
    // Si no hay código de artículo, ocultar los colores
    this.mostrarColores = false;
  }
}

coloresDisponibles(): void {

  console.log("calcula los colores posibles")
  const coloresDeArticulo = this.articulos
    .map(a => a.color?.id); // ← asegurate de que `color.id` exista


  this.coloresPosibles = this.colores.filter(color => !coloresDeArticulo.includes(color.id)).sort((a,b)=> a.id! -b.id!);
}

onColorAgregar(): void {
  const colorSeleccionado = this.coloresPosibles[this.articuloColorIndex!];

  if (colorSeleccionado) {
    console.log("este es el color seleccionado: ", colorSeleccionado.descripcion);

    this.coloresPosibles = this.coloresPosibles.filter(
      color => color.id !== colorSeleccionado.id
    );

    this.agregarArticulo(colorSeleccionado);
    this.articuloColorIndex = null;
  }
}


agregarArticulo(colorSeleccionado: Color): void {
  const articuloNuevo = { ...this.articulos[0] }; // copia superficial

  articuloNuevo.id = undefined;
  articuloNuevo.color = colorSeleccionado;
  articuloNuevo.nuevo = true;

  console.log("articulo a crear: ", articuloNuevo);

  const articulosExistentes = this.mapaArticulosACrear?.get(articuloNuevo.codigo!);
  articulosExistentes?.push(articuloNuevo)
  this.mapaArticulosACrear?.set(articuloNuevo.codigo!, articulosExistentes!)
  console.log("articulos a crear: ", this.mapaArticulosACrear);
  this.actualizarDataSource()
}


crearArticulos() {
  this.articuloService.crearArticulos(this.mapaArticulosACrear?.get(this.articulos[0].codigo!)!).subscribe({
    next: (ids: number[]) => {
      console.log('IDs generados:', ids);
      this.showBackDrop = true; // Se ejecutó correctamente el back

      setTimeout(() => {
        location.reload(); // recarga toda la página
      }, 3000);
    },
    error: (err) => {
      console.error('Error al crear artículos:', err);
      alert('Ocurrió un error al crear los artículos. Verifique e intente nuevamente.');
    }
  });

}

cargarMapa(articulos: Articulo[], mapaACargar: Map<string, Articulo[]>) {
  if (!articulos || articulos.length === 0) {
    return;
  }

  mapaACargar.clear();

  const clave = articulos[0].codigo;

  if (mapaACargar.has(clave!)) {
    const existentes = mapaACargar.get(clave!);
    if (existentes) {
      existentes.push(...articulos);
    }
  } else {
    mapaACargar.set(clave!, [...articulos]);
  }

  console.log("este es el mapa a cargar", mapaACargar);
  this.actualizarDataSource();
}



getDescripcionBase(codigo: string): string {
  const entry = this.mapaArticulosACrear?.get(codigo);
  if(codigo.startsWith("MEN")){
    return (entry![0].descripcion || '')
  }
  if (entry && entry.length > 0) {
    return `${entry[0].descripcion || ''}`;
  /*  const art = entry[0].articulo;
    return `${art?.familia?.descripcion || ''} ${art?.medida?.descripcion || ''}`;*/
  }
  return '';
}

getArticulosParaArticulo(codigo: string) {
  return this.mapaArticulosACrear?.get(codigo) || [];
}

borrarArticulo(key: any, color: string) {

}

actualizarDataSource() {
  console.log("entra a actualiar", this.mapaArticulosACrear)
  this.dataSourceCodigo = Array.from(this.mapaArticulosACrear!.entries()).map(([codigo, articulos]) => {
    return {
      codigo,
      descripcion: articulos[0]?.descripcion
    };
  });

  console.log("El data Source es:",this.dataSourceCodigo)
}


}
