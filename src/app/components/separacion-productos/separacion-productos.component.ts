import { Component, NgModule } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { Articulo } from 'src/app/models/articulo.model';
import { IngresoMercaderia } from 'src/app/models/ingreso-mercaderia.model';
import { PresupuestoArticulo } from 'src/app/models/presupuesto-articulo.model';
import { RegistroDescuento } from 'src/app/models/registro-descuento.model';
import { Taller } from 'src/app/models/taller.model';
import { MatTableDataSource } from '@angular/material/table';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { OrdenProduccionService } from 'src/app/services/orden-produccion.service';
import { TallerService } from 'src/app/services/taller.service';
import { IngresoService } from 'src/app/services/ingreso.service';
import { ArticuloService } from 'src/app/services/articulo.service';
import { catchError, map, Observable, startWith, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Presupuesto } from 'src/app/models/presupuesto.model';
import { PresupuestoService } from 'src/app/services/budget.service';
import { PedidoProduccion } from 'src/app/models/pedido-produccion.model';
import * as pdfMake from 'pdfmake/build/pdfmake';  // Importa pdfMake
import * as pdfFonts from 'pdfmake/build/vfs_fonts';  // Importa las fuentes virtuales



@Component({
  selector: 'app-separacion-productos',
  templateUrl: './separacion-productos.component.html',
  styleUrls: ['./separacion-productos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class SeparacionProductosComponent {


  
  
  talleres?: Taller[];
  articulos: Articulo[]=[];
  familiaMedida: string[] = [];
  ingresosMercaderiaXTaller: IngresoMercaderia[] =[];

  mapaPresupuestoArticulos ?: Map<string,PresupuestoArticulo[]>;
  mapaPresuXArtParaAcceder ?: Map<string,PresupuestoArticulo[]>;
  mapaArticulosModificados ?: Map<string,RegistroDescuento[]> = new Map();

  currentCliente?: Cliente;
  currentArticulo ?: Articulo;
  currentPresupuesto ?: Presupuesto;

  dataSourceCodigo = new MatTableDataSource<{ codigo: string; cantidadTotal: number; descripcion :string }>();
  dataSourceArticulos = new MatTableDataSource<{ presuArt: PresupuestoArticulo[] }>();


  
  presupuestoAAcceder ?: Presupuesto
  fechaPresupuesto?: Date;
  fechaPedidoProduccion?: Date
  producto = '';
  codigoArticulo = '';
  cantProducto = '';
  mostrarColores = false;
  mostrarConfirmacionPDF = false;
  showBackDrop=false;
  estadoPedido?:number


  currentIndex = -1;
  articuloColorIndex = -1;


  columnsToDisplay = ['Articulo', 'Cantidad', 'Descripcion'];
  articuloColumnsToDisplay = ['Articulo', 'Cantidad', 'Hay stock'];
  expandedElement: PresupuestoArticulo | undefined;

  //INPUT BUSQUEDA
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>= new Observable<string[]>();
  articuloSeleccionado ='';
 //END INPUT

  constructor(private tallerService:TallerService, private articuloService:ArticuloService, private presupuestoService:PresupuestoService, private ordenProduccionService: OrdenProduccionService , private route : ActivatedRoute) {    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit(): void {
    this.listarTalleres()
    this.mapaPresupuestoArticulos=new Map();

    this.articuloService.getAllFamiliaMedida().subscribe({
      next: (data) => {
        this.articulos = data; 
        for (let i = 0; i < this.articulos?.length; i++) {
          let item = this.articulos[i];
          if(item.familia && item.familia.descripcion && item.medida && item.medida.descripcion)
            this.options.push(item.familia?.codigo+'/'+item.medida.codigo +' '+item.familia?.descripcion + item.medida.descripcion);
          console.log(item);
          }
          console.log('items options ' +  this.options.length);       
        console.log(data);
      },
      error: (e) => console.error(e)
    });

    this.fechaPedidoProduccion = new Date(new Date().toISOString().split('T')[0]);
    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''),map(value => this._filter(String(value))));

    const presupuestoId = Number(this.route.snapshot.paramMap.get('id'));
  
    if (presupuestoId) {
      // Si el ID está presente, cargar los detalles del presupuesto
      console.log('ID del presupuesto:', presupuestoId);
      this.cargarDetallesPresupuesto(presupuestoId);
    }

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  listarTalleres(): void {

    this.currentIndex = -1;
    this.tallerService.getAll().pipe(
      catchError(error => {
        // Manejo del error
        console.error('Ocurrió un error:', error);
        alert('No se puede obtener los datos provenientes de la base de datos ');
        return throwError(() => new Error('Hubo un problema al obtener los clientes.'));
      })
    ).subscribe({
      next: (data) => {
        this.talleres = data;
        console.log(data);
      },
      error: (e) => console.error(e)
      
    });
  }

  convertirAMayuscula(){
    this.codigoArticulo = this.codigoArticulo.toUpperCase();
  }

  getCantidadTotal(presupuestoArticulos: PresupuestoArticulo[]): number {
    return (presupuestoArticulos
      .map(articulo => articulo.cantidadActual)  // Extrae la propiedad 'cantidad'
      .reduce((total, cantidad) => (total || 0) + (cantidad || 0), 0) || 0) ;  // Suma las cantidades
  }

  getFecha(fecha: Date): string {
    if (typeof fecha === 'string') {
      fecha = new Date(fecha);  // Convertimos la cadena a un objeto Date
    }
  
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${año}`
      
      return fechaFormateada;
    } else {
      return '';
    }
  }
 
  generarPDF() {
    const docDefinition = {
      content: [
        { text: 'Pedido de Producción', style: 'header' },
        { text: 'Cliente: ' + 'Nombre del Cliente' },
        // Puedes agregar más contenido aquí
      ]
    };

    // Puedes abrir, descargar o imprimir el PDF
    pdfMake.createPdf(docDefinition).open();  // Abre el PDF en una nueva ventana
    // pdfMake.createPdf(docDefinition).download('pedido-produccion.pdf'); // Descargar el PDF
    // pdfMake.createPdf(docDefinition).print(); // Imprimir el PDF
  }



validarDatosRequeridos() : Boolean{

  return Object.keys((this.currentCliente || "")).length === 0 || this.currentCliente == undefined || this.mapaPresupuestoArticulos?.size == 0 

}

cargarDetallesPresupuesto(id: Number) {
  this.presupuestoService.get(id).subscribe({
    next: (data) => {
      console.log(data);
      this.presupuestoAAcceder = data;
      this.fechaPresupuesto= this.presupuestoAAcceder.fecha
      this.currentCliente = this.presupuestoAAcceder.cliente;

      // Llamar a procesarMapaDeArticulos cuando los datos se hayan cargado
      this.procesarMapaDeArticulos();
    },
    error: (e) => console.error(e)
  });
}

procesarMapaDeArticulos() {
  if(this.presupuestoAAcceder)
  this.mapaPresuXArtParaAcceder = new Map()
  this.presupuestoAAcceder?.articulos?.forEach(presuArt => {
    const key = presuArt.articulo?.familia?.codigo + "/" + presuArt.articulo?.medida?.codigo;
    
    if (this.mapaPresuXArtParaAcceder?.has(key)) {
      const listaDePresuArtActualizada = (this.mapaPresuXArtParaAcceder.get(key) || []);
      listaDePresuArtActualizada.push(presuArt);
      this.mapaPresuXArtParaAcceder.set(key, listaDePresuArtActualizada);

    } else {
      this.mapaPresuXArtParaAcceder?.set(key, [presuArt]);
    } 

    this.mapaPresupuestoArticulos = new Map();
    this.actualizarMapaPresupuestoArticulo(this.mapaPresuXArtParaAcceder!);
      });

}


actualizarMapaPresupuestoArticulo(nuevoMap: Map<string, PresupuestoArticulo[]>){
  for (let [key, value] of nuevoMap) {
    if(this.mapaPresupuestoArticulos)
    if (this.mapaPresupuestoArticulos.has(key)) {
      const listaExistente = this.mapaPresupuestoArticulos.get(key)!;
      
      // Concatenar ambas listas
      const nuevaLista =listaExistente.concat(value);
      
      // Actualizar el Map con la nueva lista concatenada
      this.mapaPresupuestoArticulos.set(key, nuevaLista);
    } else {
      // Si no existe la clave, se agrega tal cual desde el nuevoMap
      this.mapaPresupuestoArticulos.set(key, value);
    }
  }
  if(this.mapaPresupuestoArticulos){
    this.dataSourceCodigo.data = Array.from(this.mapaPresupuestoArticulos.entries()).map(
      ([codigo, presupuestosArticulos]) => ({
        codigo,
        cantidadTotal : this.cantidadTotalXCodigo(codigo),
        descripcion : presupuestosArticulos[0].articulo?.familia?.descripcion + " " + presupuestosArticulos[0].articulo?.medida?.descripcion
      })
    );
    console.log("ACÁ VA A LEER LOS CÓDIGOS")
    console.log(this.dataSourceCodigo.data)
  }

  if(this.mapaPresupuestoArticulos){
    this.dataSourceArticulos.data = Array.from(this.mapaPresupuestoArticulos.entries()).map(
      ([codigo, presupuestosArticulos]) => ({
      presuArt : presupuestosArticulos  
      })
    );
    console.log("ACÁ VA A LEER LOS ARTICULOS")
    console.log(this.dataSourceArticulos.data)

  }
}

cantidadTotalXCodigo(unCodigo: string): number {
 const listaPresusArtXCodigo = this.mapaPresupuestoArticulos?.get(unCodigo)
 if (!listaPresusArtXCodigo) return 0;
 return listaPresusArtXCodigo.reduce((total, presuArt) => total + presuArt.cantidad!, 0)
}

cantidadActualDepoducto():string {
  if (this.currentArticulo) {
    const claveMapa: string = this.currentArticulo?.familia?.codigo + "/" + this.currentArticulo.medida?.codigo;
    
    if (this.mapaPresupuestoArticulos?.has(claveMapa)) {
      const pa = this.mapaPresupuestoArticulos.get(claveMapa) as PresupuestoArticulo[];
      const articuloExistente = pa.find(a => a.articulo?.id == this.currentArticulo?.id);
      
      if (articuloExistente) {
        return articuloExistente!.cantidadActual!.toString(); // Devuelve la cantidad actual como string para mostrarla
      }
    }
  }
  return '0'; // Devuelve '0' si no existe el artículo
} 

actualizarArticuloSeleccionado(){
  if (this.articulos && this.articulos.length > 0) {
    this.currentArticulo = this.articulos[this.articuloColorIndex]; // Actualiza el artículo seleccionado
  }
}



  formatearFecha(fecha: any): string {
    const fechaObj = new Date(fecha);
    return isNaN(fechaObj.getTime()) ? 'Fecha inválida' : `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
  }

  getArticulosParaArticulo(codigo: string): PresupuestoArticulo[]{
    const todosLosArticulos = this.dataSourceArticulos.data.flatMap(element => element.presuArt);
    const listaDeArticulosDeFila = todosLosArticulos.filter(presuArt=>presuArt.articulo!.familia?.codigo + "/" + presuArt.articulo?.medida?.codigo == codigo)
    return listaDeArticulosDeFila
  }
  
  generarPedidosProduccion() {
    const todosLosArticulos = this.dataSourceArticulos.data.flatMap(element => element.presuArt);
    const articulosAPedir = todosLosArticulos.filter(presuArt => presuArt.hayStock === false);
    console.log("ARTICULOS A PEDIR", articulosAPedir)
  
    const pedidosProduccion: PedidoProduccion[] = [];
  
    for (const taller of this.talleres!) {
      const articulosXTaller = articulosAPedir.filter(presuArt => presuArt.articulo?.idFabricante === taller.id);
  
      if (articulosXTaller.length === 0) continue;
      articulosXTaller.forEach(presuArt=> {presuArt.cantidadPendiente = presuArt.cantidad; presuArt.presupuesto = this.currentPresupuesto})
  
      const pedidoProduccion = new PedidoProduccion(this.fechaPedidoProduccion!, taller, 3, articulosXTaller, this.currentCliente!.id);
  
      pedidosProduccion.push(pedidoProduccion);
      // Crear un nuevo orden de pedido
  /*    this.ordenProduccionService.crear(pedidoProduccion).subscribe(idPedidoProduccion => {
        pedidoProduccion.id = idPedidoProduccion;
        console.log('ID creado:', idPedidoProduccion);
      });
      
      if (pedidoProduccion.id) {
        // Aquí puedes reiniciar el formulario y mostrar el número del presupuesto
        console.log('Orden de pedido creada');
      }*/
    }
  
    console.log('Pedidos generados:', pedidosProduccion);
    this.mostrarConfirmacionPDF = true;
 }

 confirmarGenerarPDF(generar: boolean) {
  if (generar) {
    this.generarPDF();
  }
  this.mostrarConfirmacionPDF = false;
}


}
