import { Component, NgModule } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Articulo } from 'src/app/models/articulo.model';
import { Ingreso } from 'src/app/models/ingreso.model';
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
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ArticuloPrecio } from 'src/app/models/articulo-precio.model';
import { EstadoPedidoProduccion } from 'src/app/models/estado-presupuesto.model';

(pdfMake as any).vfs = (pdfFonts as any).vfs;






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

logoBase64: String = 'data:image/png;base64,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'

  
  
  talleres?: Taller[];
  articulosPrecio: ArticuloPrecio[]=[];
  articulos: Articulo[]=[];
  familiaMedida: string[] = [];
  ingresosMercaderiaXTaller: Ingreso[] =[];
  pedidosProduccionesGenerados: PedidoProduccion[] = [];
  estadosPedidoProduccion: EstadoPedidoProduccion[] = [];


  mapaPresupuestoArticulos ?: Map<string,PresupuestoArticulo[]>;
  mapaPresuXArtParaAcceder ?: Map<string,PresupuestoArticulo[]>;
  mapaArticulosModificados ?: Map<string,RegistroDescuento[]> = new Map();

  currentCliente?: Cliente;
  currentArticulo ?: Articulo;
  currentPresupuesto ?: Presupuesto;

  dataSourceCodigo = new MatTableDataSource<{ codigo: string; cantidadTotal: number; descripcion :string, taller: Taller }>();
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
  estadoPedido = 1


  currentIndex = -1;
  articuloColorIndex = -1;


  columnsToDisplay = ['Articulo', 'Cantidad', 'Descripcion', 'Hay stock', 'Taller'];
  articuloColumnsToDisplay = ['Articulo', 'Cantidad', 'Hay stock', 'Taller'];
  expandedElement: PresupuestoArticulo | undefined;

  //INPUT BUSQUEDA
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>= new Observable<string[]>();
  articuloSeleccionado ='';
 //END INPUT

  constructor(private ordenDeProduccionService : OrdenProduccionService,  private tallerService:TallerService, private articuloService:ArticuloService, private presupuestoService:PresupuestoService, private ordenProduccionService: OrdenProduccionService , private route : ActivatedRoute, private router: Router) { 
  }

  ngOnInit(): void {
    this.listarTalleres()
    this.mapaPresupuestoArticulos=new Map();

    this.articuloService.getAllArticuloPrecio().subscribe({
      next: (data) => {
        this.articulosPrecio = data; 
        for (let i = 0; i < this.articulosPrecio?.length; i++) {
          let item = this.articulosPrecio[i];
          if(item.codigo && item.descripcion)
            this.options.push(item.codigo + ' ' + item.descripcion);
          console.log(item);
          }
          console.log('items options ' +  this.options.length);       
        console.log(data);
      },
      error: (e) => console.error(e)
    });

    this.fechaPedidoProduccion = new Date();
    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''),map(value => this._filter(String(value))));

    const presupuestoId = Number(this.route.snapshot.paramMap.get('id'));
  
    if (presupuestoId) {
      // Si el ID está presente, cargar los detalles del presupuesto
      console.log('ID del presupuesto:', presupuestoId);
      this.cargarDetallesPresupuesto(presupuestoId);
    }

      this.ordenDeProduccionService.getEstadosPedidoProduccion().subscribe({
      next: (estados) => {
        console.log(estados)
        this.estadosPedidoProduccion = estados;
      },
      error: (err) => {
        console.error('Error al obtener estados:', err);
      }
    });

  

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
        alert('Error al acceder a datos provenientes de la base de datos ');
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
      .map(articulo => articulo.cantidad)  // Extrae la propiedad 'cantidad'
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
  
    const docDefinition: any = {
      content: [
        {
          columns: [
            {
              text: `Reporte de Pedidos Producción \n de \n ${this.currentCliente!.razonSocial}`,
              style: 'header',
              width: '*',
            },
            {
              stack: [
                {
                  text: 'Loria 1140 - Lomas de Zamora',
                  style: 'caption',
                  alignment: 'center', // Alineación al centro
                },
                {
                  text: 'Teléfono: 11-6958-2829',
                  style: 'caption',
                  alignment: 'center', // Alineación al centro
                },
              ],
              width: 'auto', // Asegura que la columna ocupe solo el espacio necesario
            },
          ],
        },
      ],
      styles: this.getStyles(),
    };
  
    // Iterar sobre la lista de pedidos de producción
    this.pedidosProduccionesGenerados.forEach((pedido) => {
      const mapaPresuArtTabla = this.generarMapaPresuArt(pedido)
      // Agregar subtítulo con el taller y la fecha
      docDefinition.content.push({
        text: `${pedido.taller?.razonSocial} - ${this.formatearFecha(pedido.fecha)} - ID: ${pedido.id}`,
        style: 'header',
        margin: [0, 10, 0, 5],
      });
  
      // Crear tabla para los artículos del pedido
      docDefinition.content.push({
        table: {
          headerRows: 1,
          widths: [100, 300, 100],  // Ajustá según tu diseño
          body: [
            [
              { text: 'Código', style: 'tableHeader' },
              { text: 'Descripción', style: 'tableHeader' },
              { text: 'Cantidad', style: 'tableHeader' }
            ],
            ...Array.from(mapaPresuArtTabla.entries()).map(([clave, presupuestosArticulos]) => {
              const totalCantidad = presupuestosArticulos
                .map(pa => pa.cantidad || 0)
                .reduce((acc, curr) => acc + curr, 0);
          
              const descripcion = presupuestosArticulos[0]?.descripcion || '';
              const descripcionColores = presupuestosArticulos
                .map(pa => `${pa.cantidad || 0}${pa.articulo?.color?.codigo || ''}`)
                .join(' ');
          
              return [
                { text: clave, style: 'tableCell' },
                { text: `${descripcion} ${descripcionColores}`, style: 'tableCell' },
                { text: totalCantidad.toString(), style: 'tableCell' }
              ];
            })
          ]
          
        },
        layout: 'lightHorizontalLines',
      });

    //  docDefinition.content.push({ canvas: [ { type: 'line', x1: 0, y1: 0, x2: 532, y2: 0, lineWidth: 2 } ] });  POSIBLE LINEA DIVISORIA

  
      // Agregar un espacio de separación entre los pedidos
      docDefinition.content.push({ text: '', margin: [0, 10, 0, 10] });
    });
  
    // Generar el PDF
    pdfMake.createPdf(docDefinition).download('Pedidos_Produccion.pdf');
  }
  // Método para devolver los estilos
  getStyles() {
    return {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 10, 0, 10]
      },
      caption: {
        fontSize: 9,
        italics: true,
        alignment: 'center',
        margin: [0, 2, 0, 2]
      },
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'white',
        fillColor: '#4a4a4a',
        alignment: 'center',
        margin: [0, 6, 0, 6]
      },
      tableCell: {
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
  
  cancelarPDF() {
    this.mostrarConfirmacionPDF = false;
    this.router.navigate(['/selectBudget']);
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
    const key = presuArt?.codigo!;
    
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
        descripcion : presupuestosArticulos[0].descripcion!,
        taller : this.talleres?.filter(taller=>taller.id == presupuestosArticulos[0].articulo?.idFabricante)[0]!
      })
    );
  }

  if(this.mapaPresupuestoArticulos){
    this.dataSourceArticulos.data = Array.from(this.mapaPresupuestoArticulos.entries()).map(
      ([codigo, presupuestosArticulos]) => ({
      presuArt : presupuestosArticulos
      })
    );
  }

  console.log("Aca esta el dataSource",this.dataSourceCodigo)
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
        return articuloExistente!.cantidad!.toString(); // Devuelve la cantidad actual como string para mostrarla
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

actualizarTallerParaCodigo(element: any, nuevoTaller: Taller) {
  const codigoArticulo = element.codigo;

  if (!this.mapaPresupuestoArticulos?.has(codigoArticulo)) return;

  const lista = this.mapaPresupuestoArticulos.get(codigoArticulo);
  if (!lista) return;

  lista.forEach(pa => {
    pa.articulo!.idFabricante = Number(nuevoTaller.id);
  });

  // Si también querés actualizar el `taller` (objeto completo) para reflejarlo en pantalla:
  element.taller = nuevoTaller;

  console.log("este es el mapa actualizado", this.mapaPresupuestoArticulos)

}

actualizarTallerIndividual(presuArt: PresupuestoArticulo, nuevoTallerId: number) {
  const codigo = presuArt.codigo;

  if (!this.mapaPresupuestoArticulos?.has(codigo!)) return;

  const lista = this.mapaPresupuestoArticulos.get(codigo!);
  if (!lista) return;

  const entrada = lista.find(pa => pa.articulo?.id === presuArt.articulo?.id);
  if (entrada) {
    entrada.articulo!.idFabricante = nuevoTallerId;
  }

  console.log("este es el mapa actualizado", this.mapaPresupuestoArticulos)
}

todosConStock(codigo: string): boolean {
  const articulos = this.getArticulosParaArticulo(codigo);
  return articulos.every(a => a.hayStock);
}

// Marca o desmarca todos los artículos con ese código
toggleStockTodos(codigo: string, valor: boolean) {
  const articulos = this.getArticulosParaArticulo(codigo);
  articulos.forEach(a => a.hayStock = valor);
}

    getArticulosParaArticulo(codigo: string): PresupuestoArticulo[]{
      const todosLosArticulos = this.dataSourceArticulos.data.flatMap(element => element.presuArt);
      const listaDeArticulosDeFila = todosLosArticulos.filter(presuArt=>presuArt.codigo == codigo)
      return listaDeArticulosDeFila
    }
  formatearFecha(fecha: any): string {
    const fechaObj = new Date(fecha);
    return isNaN(fechaObj.getTime()) ? 'Fecha inválida' : `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
  }
  
  generarPedidosProduccion() {
    console.log(this.talleres)
    const todosLosArticulos = this.dataSourceArticulos.data.flatMap(element => element.presuArt);
    const articulosAPedir = todosLosArticulos.filter(presuArt => presuArt.hayStock === false);
    console.log("ARTICULOS A PEDIR", articulosAPedir)
  
    const pedidosProduccion: PedidoProduccion[] = [];
  
    for (const taller of this.talleres!) {
      const articulosXTaller = articulosAPedir.filter(presuArt => presuArt.articulo?.idFabricante === Number(taller.id));
  
      if (articulosXTaller.length === 0) continue;
      articulosXTaller.forEach(presuArt=> {presuArt.cantidadPendiente = presuArt.cantidad; presuArt.presupuesto = this.currentPresupuesto; presuArt.codigo = presuArt.codigo; presuArt.descripcion = presuArt?.descripcion})
  
      const idEstadoCreado = this.estadosPedidoProduccion.find(estado=>estado.codigo=='CR')?.id
      const pedidoProduccion = new PedidoProduccion(this.fechaPedidoProduccion!, taller, idEstadoCreado!, articulosXTaller, this.currentCliente!.id, this.presupuestoAAcceder?.id);
  
      this.pedidosProduccionesGenerados.push(pedidoProduccion);
      // Crear un nuevo orden de pedido
      this.ordenProduccionService.crear(pedidoProduccion).subscribe(idPedidoProduccion => {
        pedidoProduccion.id = idPedidoProduccion;
        console.log('ID creado:', idPedidoProduccion);
      });
      
      if (pedidoProduccion.id) {
        // Aquí puedes reiniciar el formulario y mostrar el número del presupuesto
        console.log('Orden de pedido creada');
      }
    }
  
    console.log('Pedidos generados:', this.pedidosProduccionesGenerados);
    this.mostrarConfirmacionPDF = true;
 }

 actualizarHayStockDeArticulos() {
  this.mapaArticulosModificados = new Map<string, PresupuestoArticulo[]>();

  this.dataSourceArticulos.data.forEach(item => {
    item.presuArt.forEach(presuArt => {
      const codigo = presuArt.codigo;
      if (!codigo) return;

      const listaExistente = this.mapaArticulosModificados?.get(codigo);
      if (listaExistente) {
        listaExistente.push(presuArt);
      } else {
        this.mapaArticulosModificados?.set(codigo, [presuArt]);
      }
    });
  });

  const listaDeArticulos: PresupuestoArticulo[] = Array.from(this.mapaArticulosModificados.values()).flat();
  console.log("ArticulosModificados:", listaDeArticulos)
  console.log("Articulos de presupuesto a actualizar", this.presupuestoAAcceder?.articulos)

  const hayAlgunoConStock = listaDeArticulos.some(p => p?.hayStock === true);

  console.log(hayAlgunoConStock)
  console.log(this.presupuestoAAcceder)

  if (hayAlgunoConStock && this.presupuestoAAcceder) {
    this.presupuestoAAcceder.articulos = listaDeArticulos;

    const todosConStock = listaDeArticulos.every(art => art.hayStock === true);

    // Si todos tienen stock, y no hay estado asignado, lo ponemos como "Armado" (id = 4)
    if (todosConStock) {
      if (!this.presupuestoAAcceder.estadoPresupuesto) {
        this.presupuestoAAcceder.estadoPresupuesto = { id: 4, descripcion: 'Armado', codigo: "ARM" };
      } else {
        this.presupuestoAAcceder.estadoPresupuesto.id = 4;
      }
    } else {
      if (!this.estadoPedido) {
        this.presupuestoAAcceder.estadoPresupuesto = { id: 1, descripcion: 'Creado', codigo: "CRE" };
      } else {
        if (!this.presupuestoAAcceder.estadoPresupuesto) {
          this.presupuestoAAcceder.estadoPresupuesto = { id: this.estadoPedido, descripcion: '', codigo: '' };
        } else {
          this.presupuestoAAcceder.estadoPresupuesto.id = this.estadoPedido;
        }
      }
      
    }

    console.log("Este es el presupuesto a actualizar",this.presupuestoAAcceder);
    this.presupuestoService.actualizar(this.presupuestoAAcceder).subscribe((id: object)=>{

    });
  }
}



 confirmarGenerarPDF(generar: boolean) {
  if (generar) {
    this.generarPDF();
  }
}

generarMapaPresuArt(pedidoProduccion: PedidoProduccion): Map<string, PresupuestoArticulo[]> {
  const mapaNuevo = new Map<string, PresupuestoArticulo[]>();

  for (const articulo of pedidoProduccion.articulos!) {
    const key = articulo.codigo!;

      if (mapaNuevo.has(key)) {
        const listaExistente = mapaNuevo.get(key)!;
        
        // Concatenar ambas listas
        const nuevaLista =listaExistente.concat(articulo);
        
        // Actualizar el Map con la nueva lista concatenada
        mapaNuevo.set(key, nuevaLista);
      } else {
        // Si no existe la clave, se agrega tal cual desde el nuevoMap
        mapaNuevo.set(key, [articulo]);
      }
  }

  return mapaNuevo;
}


}
