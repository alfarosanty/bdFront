import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { ArticuloPrecio } from 'src/app/models/articulo-precio.model';
import { Articulo } from 'src/app/models/articulo.model';
import { ConsultaTallerCortePorCodigo } from 'src/app/models/consulta-medida.model';
import { PedidoProduccion } from 'src/app/models/pedido-produccion.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import { OrdenProduccionService } from 'src/app/services/orden-produccion.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class StockListComponent {

articuloSeleccionado ='';
cantidadTotalEnCorteArticulo?: {codigo: string, cantidadEnCorte:number}[];
cantidadTotalEnTallerArticulo?: {codigo: string, cantidadEnCorte:number}[];

//LISTAS
articulosPrecio: ArticuloPrecio[]=[];
articulos: Articulo[]=[];
pedidosProduccion: PedidoProduccion[]=[]
cantidadesCorteTallerArticulo: ConsultaTallerCortePorCodigo[]=[]

//MAPAS
mapaArticulos ?: Map<string, Articulo[]> = new Map();
mapaArticulosXInformacion?: Map<string, ConsultaTallerCortePorCodigo>




// INPUTS
articuloControl = new FormControl();
filteredArticulos: Observable<string[]>= new Observable<string[]>();
options: string[] = [];
filterValue ='';



//MAT COMPONENTS
columnsToDisplay = ['Artículo', 'Descripcion', 'En corte', 'En taller', 'Stock'];
articuloColumnsToDisplay = ['Artículo', 'En corte', 'En taller', 'Stock'];
expandedElement: any | null;
dataSourceCodigo: any[] = []; // debe contener objetos con: codigo, descripcion

constructor(private articuloService: ArticuloService, private cdr: ChangeDetectorRef){}


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




  this.filteredArticulos = this.articuloControl.valueChanges.pipe(startWith(''),map(value => this._filterArticulos(String(value))));


}

private _filterArticulos(value: string): string[] {
  this.filterValue = value.toLowerCase();
 // this.articuloControl.setValue(this.options.filter(option => option.toLowerCase().includes(this.filterValue))[0]);
  this.articuloControl.value
 return this.options.filter(option => option.toLowerCase().includes(this.filterValue));
}

mostrarVariedadColores() {
  this.articulos = [];

  const articuloPrecioDeseado = this.articulosPrecio.find(
    articuloPrecio => articuloPrecio.codigo + " " + articuloPrecio.descripcion === this.articuloSeleccionado
  );

  switch (true) {
    case (this.articuloSeleccionado?.toUpperCase() === 'TODOS'):
      this.articuloService.getAll().subscribe({
        next: (data) => {
          this.articulos = data;
          this.articulos.sort((a, b) => {
            if (!a.codigo) return 1;
            if (!b.codigo) return -1;
            return a.codigo.localeCompare(b.codigo);
          });
          this.cargarMapa(this.articulos, this.mapaArticulos!);
          this.cargarCantidadesEnTallerYCorte(articuloPrecioDeseado?.id!)
          this.cdr.detectChanges();
        },
        error: (e) => console.error('Error al obtener artículos:', e)
      });
      break;  // mejor usar break en switch para seguir el flujo normal
  
    case (!articuloPrecioDeseado):
      alert("El artículo seleccionado no existe");
      break;
  
    default:
      const idArticuloPrecioDeseado = articuloPrecioDeseado?.id;
      this.articuloService.getByArticuloPrecio(idArticuloPrecioDeseado, false).subscribe({
        next: (data) => {
          this.articulos = data;
          this.articulos.sort((a, b) => (b.id || 0) - (a.id || 0));
          this.cargarMapa(this.articulos, this.mapaArticulos!);
          this.cargarCantidadesEnTallerYCorte(idArticuloPrecioDeseado!)
          this.cdr.detectChanges();
        },
        error: (e) => console.error('Error al obtener artículos:', e)
      });

      break;
  }


}

cargarCantidadesEnTallerYCorte(idArticuloPrecioDeseado: number){

  if(idArticuloPrecioDeseado){
    
  }

  this.articuloService.getCantidadesTallerCortePorArticulo(idArticuloPrecioDeseado!).subscribe({
    next: (data) => {
      this.cantidadesCorteTallerArticulo = data
      console.log("articulosDeLaBD:", this.cantidadesCorteTallerArticulo)
      this.cantidadesCorteTallerArticulo.forEach(objetoConInfo=>{
        this.mapaArticulosXInformacion?.clear()
        this.mapaArticulosXInformacion?.set(objetoConInfo.codigo!, objetoConInfo)
      })
    },
    error: (e) => console.error(e)
  });
}

calcularTotalEnCorteArticulo(){

}

calcularTotalEnTallerArticulo(){
  
}

cargarMapa(articulos: Articulo[], mapaACargar: Map<string, Articulo[]>) {
  if (!articulos || articulos.length === 0) {
    return;
  }

  mapaACargar.clear();

  for (const articulo of articulos) {
    const clave = articulo.codigo;

    if (!clave) {
      // Si un artículo no tiene código, podés decidir si lo ignorás o lo manejás aparte
      continue;
    }

    if (mapaACargar.has(clave)) {
      const existentes = mapaACargar.get(clave);
      if (existentes) {
        existentes.push(articulo);
      }
    } else {
      mapaACargar.set(clave, [articulo]);
    }
  }

  this.actualizarDataSource();
}


actualizarDataSource() {
  this.dataSourceCodigo = Array.from(this.mapaArticulos!.entries()).map(([codigo, articulos]) => {
    return {
      codigo,
      descripcion: articulos[0]?.descripcion,
      enCorte: this.cantidadTotalEnCorteArticulo,
      enTaller: this.cantidadTotalEnTallerArticulo,
      stock: this.calcularStock(codigo,this.mapaArticulos!)
    };
  });
}


getArticulosParaArticulo(codigo: string) {
  return this.mapaArticulos?.get(codigo) || [];
}

calcularStock(codigo: string, mapaArticulos: Map<string, Articulo[]>): number {
  const listaArticulos = mapaArticulos.get(codigo) || [];
  return listaArticulos.reduce((total, articulo) => total + (articulo.stock || 0), 0);
}


}