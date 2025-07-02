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
  styleUrls: ['./articulo-configuracion.component.css']
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
articulosACrear: Articulo[]=[];
coloresPosibles: Color[]=[];


// INPUTS
articuloControl = new FormControl();
filteredArticulos: Observable<string[]>= new Observable<string[]>();
options: string[] = [];
filterValue ='';

// FLAGS
showBackDrop = false




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
    this.articuloService.getByArticuloPrecio(idArticuloPrecioDeseado).subscribe({
      next: (data) => {
        this.articulos = data;
        this.coloresDisponibles()
        this.articulos.sort((a, b) => {
          const descA = a.color?.descripcion?.toLowerCase() || '';
          const descB = b.color?.descripcion?.toLowerCase() || '';
          return descA.localeCompare(descB);

        });
        

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

  console.log("articulo a crear: ", articuloNuevo);

  this.articulosACrear.push(articuloNuevo);
  console.log("articulos a crear: ", this.articulosACrear);
}


crearArticulos() {
  this.articuloService.crearArticulos(this.articulosACrear).subscribe({
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





}
