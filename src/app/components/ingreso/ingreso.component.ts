import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators'
import { Articulo } from 'src/app/models/articulo.model';
import { PresupuestoArticulo } from 'src/app/models/presupuesto-articulo.model';
import { Presupuesto } from 'src/app/models/presupuesto.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import { PresupuestoService } from 'src/app/services/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Taller } from 'src/app/models/taller.model';
import { PedidoProduccion } from 'src/app/models/pedido-produccion.model';
import { OrdenProduccionService } from 'src/app/services/orden-produccion.service';
import { TallerService } from 'src/app/services/taller.service';
import { IngresoService } from 'src/app/services/ingreso.service';
import { IngresoMercaderia } from 'src/app/models/ingreso-mercaderia.model';
import { RegistroDescuento } from 'src/app/models/registro-descuento.model';
import { firstValueFrom } from 'rxjs';
import { EstadoPresupuesto } from 'src/app/models/estado-presupuesto.model';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ArticuloPrecio } from 'src/app/models/articulo-precio.model';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

  const imagenBase64 = "data:image/png;base64,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";  // Asegúrate de tener la cadena completa

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
})
export class IngresoComponent {
  // DATOS DE FOCUS EN HTML
  @ViewChild('inputColores') inputColores!: MatSelect;
  @ViewChild('inputCantidad') inputCantidad!: ElementRef<HTMLInputElement>;
  @ViewChild('inputArticulos') inputArticulos!: ElementRef<HTMLInputElement>;


  
  talleres?: Taller[];
  articulosPrecio: ArticuloPrecio[] = [];
  articulos: Articulo[]=[];
  familiaMedida: string[] = [];
  ingresosMercaderiaXTaller: IngresoMercaderia[] =[];
  ingresosMercaderiaXTallerFiltrados: IngresoMercaderia[] =[];
  pedidosProduccionXTaller: PedidoProduccion[] = [];
  presupuestosAModificar : Presupuesto[] = [];
  mapaPresupuestoArticulos ?: Map<string,PresupuestoArticulo[]>;
  mapaPresuXArtParaAcceder ?: Map<string,PresupuestoArticulo[]>;
  mapaArticulosModificados ?: Map<string,RegistroDescuento[]> = new Map();

  ingresoMercaderiaSeleccionado?: PedidoProduccion
  currentTaller?: Taller;
  currentArticulo ?: Articulo;
  currentIngresoMercaderia?: IngresoMercaderia;
  curentPedidoProduccion ?: PedidoProduccion

  ingresoMercaderiaAAcceder ?: IngresoMercaderia
  fechaIngresoMercaderia?: Date;
  producto = '';
  codigoArticulo = '';
  cantProducto?:  string|null=null;
  mostrarColores = false;


  currentIndex = -1;
  articuloColorIndex: number | null = null;

  //INPUT BUSQUEDA
  articuloControl = new FormControl();
  options: string[] = [];
  filteredArticulos: Observable<string[]>= new Observable<string[]>();
  articuloSeleccionado ='';
 //END INPUT

 //MAT COMPONENTS
  columnsToDisplay = ['Artículo', 'Descripcion', 'Cantidad', 'Borrar'];
  articuloColumnsToDisplay = ['Artículo', 'Cantidad', 'Borrar'];
  expandedElement: any | null;
  dataSourceCodigo: any[] = []; // debe contener objetos con: codigo, descripcion
  mostrarConfirmacionPDF = false;


  constructor(private tallerService:TallerService, private articuloService:ArticuloService, private ingresoService:IngresoService, private ordenProduccionService: OrdenProduccionService, private presupuestoService: PresupuestoService , private route : ActivatedRoute, private cdr: ChangeDetectorRef, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.listarTalleres();
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

    this.fechaIngresoMercaderia = new Date();



    this.filteredArticulos = this.articuloControl.valueChanges.pipe(startWith(''),map(value => this._filter(String(value))));

    this.actualizarDataSource();

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


listarTalleres(): void {

    this.currentTaller = {};
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
 

  seleccionarTaller(): void {
    if(this.talleres){
      this.currentTaller = this.talleres[this.currentIndex];
      console.log(this.currentTaller)
      console.log("ESTE ES EL INDEX", this.currentIndex)
    }
  }

  buscarIngresosXTaller(){
    if(this.currentTaller){
     this.ingresoService.getByTaller(this.currentTaller?.id).subscribe({
      next: (data) => {
        this.ingresosMercaderiaXTaller = data;
        this.ingresosMercaderiaXTallerFiltrados=data;
        console.log("LOS INGRESOS DE MERCADERIA DE " + this.currentTaller?.razonSocial + " SON:",this.ingresosMercaderiaXTaller)
      },
      error: (e) => console.error(e)
  
    });
    }
  }

  buscarOrdenXTaller(){
    if(this.currentTaller){
     this.ordenProduccionService.getByTaller(this.currentTaller?.id).subscribe({
      next: (data) => {
        this.pedidosProduccionXTaller = data;
        console.log("LAS ORDENES DE PRODUCCION DE " + this.currentTaller?.razonSocial + " SON:",this.pedidosProduccionXTaller)
      },
      error: (e) => console.error(e)
  
    });
    }
  }

  convertirAMayuscula(){
    this.codigoArticulo = this.codigoArticulo.toUpperCase();
  }

  mostrarVariedadColores() {
    this.articulos = [];
    const articuloPrecioDeseado = this.articulosPrecio.filter(articuloPrecio=>articuloPrecio.codigo + " " + articuloPrecio.descripcion ===this.articuloSeleccionado)[0]

    // Verifica si hay un código de artículo
    if (articuloPrecioDeseado) {
      // Separa el código en familia y medida
      console.log("artiulosPrecio", this.articulosPrecio)
      console.log(articuloPrecioDeseado)
      if(!articuloPrecioDeseado){alert("El artículo seleccionado no existe")}
      const idArticuloPrecioDeseado = articuloPrecioDeseado.id
      console.log(`Artículo deseado: ${this.codigoArticulo} y su articuloPrecioId: ${idArticuloPrecioDeseado}`)
  
      // Llama al servicio para obtener artículos según la familia y medida
      this.articuloService.getByArticuloPrecio(idArticuloPrecioDeseado, true).subscribe({
        next: (data) => {
          this.articulos = data;
          this.articulos.sort((a, b) => {
            const descA = a.color?.descripcion?.toLowerCase() || '';
            const descB = b.color?.descripcion?.toLowerCase() || '';
            return descA.localeCompare(descB);
          });
          
            // Remover colores ya cargados
          var idspa = this.mapaPresupuestoArticulos?.get(articuloPrecioDeseado.codigo!)?.map(pa => pa.articulo?.id);
          
          if (idspa) {
            this.articulos = this.articulos.filter(articulo => !(idspa?.includes(articulo.id)));
          }
  
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
  


mostrarColoresDisponibles(articulo : Articulo) : string {
  return (articulo.color?.descripcion || "");
  }
  



  agregarArticulo() {
    if (!this.articulos) return;
  
    if(this.cantProducto == '' || this.cantProducto == undefined || Number(this.cantProducto) == 0){
      return
    }
    this.currentArticulo = this.articulos[this.articuloColorIndex!];
  
    this.articulos = this.articulos.filter(
      articulo => articulo.id !== this.currentArticulo?.id
    );
  
    if (!this.currentArticulo) return;

  
    // Validar y convertir la cantidad ingresada
    const cantidadNum = Number(this.cantProducto);
    const claveMapa: string = this.currentArticulo.codigo!;
    console.log("🔑 Clave del mapa:", claveMapa);
  
    let pa: PresupuestoArticulo[] = this.mapaPresupuestoArticulos?.get(claveMapa) ?? [];
  
    const articuloExistente = pa.find(
      a => a.articulo?.id === this.currentArticulo?.id
    );
  
    if (articuloExistente) {
      articuloExistente.cantidad = cantidadNum;
      articuloExistente.cantidadActual = cantidadNum;
      articuloExistente.cantidadOriginal = cantidadNum;
      articuloExistente.cantidadPendiente = cantidadNum;
      console.log("✅ Actualizado artículo existente con nueva cantidad:", cantidadNum);
    } else {
      const nuevoArticulo: PresupuestoArticulo = {
        articulo: this.currentArticulo,
        cantidad: cantidadNum,
        cantidadActual: cantidadNum,
        cantidadOriginal: cantidadNum,
        cantidadPendiente: cantidadNum,
        descripcion: this.currentArticulo.descripcion,
        codigo: this.currentArticulo.codigo,
        hayStock: false
      };
  
      pa.push(nuevoArticulo);
      console.log("🆕 Agregado nuevo artículo:", nuevoArticulo);
    }
  
    this.mapaPresupuestoArticulos?.set(claveMapa, pa);
        console.log("🧾 Cantidades en la clave:", pa.map(p => p.cantidad));
  
    this.actualizarDataSource();
  
    this.articuloColorIndex = null;
    this.cantProducto = null      
  
    setTimeout(() => {
      this.inputArticulos.nativeElement.focus();
      this.inputArticulos.nativeElement.select();
    });
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

borrarFila(key : any){
    
  this.mapaPresupuestoArticulos?.delete(key);
  this.actualizarDataSource();
  
  }


borrarArticulo(key: any, color: string) {
  const articulos = this.mapaPresupuestoArticulos?.get(key);
  if (articulos) {
  const index = articulos.findIndex(presuArt => presuArt.articulo?.color?.codigo === color);
  if (index !== -1) {
      articulos.splice(index, 1);
      this.mapaPresupuestoArticulos?.set(key, articulos);
      
        // Si la lista está vacía, eliminar la clave
        if (articulos.length === 0) {
          this.mapaPresupuestoArticulos?.delete(key);
          }
      
          // Guarda el código expandido actual antes de actualizar
          const codigoExpandido = this.expandedElement?.codigo;
      
          this.actualizarDataSource();
      
          // Reasignar el elemento expandido si sigue existiendo
          const nuevoElementoExpandido = this.dataSourceCodigo.find(e => e.codigo === codigoExpandido);
          if (nuevoElementoExpandido) {
          this.expandedElement = nuevoElementoExpandido;
          } else {
            this.expandedElement = undefined; // Si ya no existe, lo cerramos
        }
        }
      }
    }

    editarFila(key: any) {
      this.codigoArticulo = key;
      this.articulos = [];
    
      if (this.codigoArticulo) {
    
        this.articuloService.getByArticuloPrecio(this.codigoArticulo, true).subscribe({
          next: (data) => {
            this.articulos = data;
            this.mostrarColores = this.articulos.length > 0;
          },
          error: (e) => console.error('Error al obtener artículos:', e)
        });
    
      } else {
        this.mostrarColores = false;
      }
    
      this.actualizarDataSource();
    }
      
  
    generarOrdenDePedido() {

      if (!this.currentIngresoMercaderia) {
        this.currentIngresoMercaderia = {
          taller: undefined, // Asegúrate de establecer los valores adecuados para las propiedades
          articulos: [],
          fecha: new Date() // Establece una fecha por defecto si es necesario
        };
      }


      if (!this.validarDatosRequeridos()) {
        // Asignar taller y otros valores
        this.currentIngresoMercaderia.taller=this.currentTaller
        this.currentIngresoMercaderia!.id=this.ingresoMercaderiaAAcceder?.id
        this.currentIngresoMercaderia!.articulos = [];
        if(this.fechaIngresoMercaderia != undefined){this.currentIngresoMercaderia!.fecha = this.fechaIngresoMercaderia}
     
    
        // Recorrer el mapa de artículos y agregarlos a la orden
        this.mapaPresupuestoArticulos?.forEach((valor, clave) => {
          valor.forEach(presuArt => {
            console.log(presuArt.articulo?.color?.descripcion + ' ' + presuArt.cantidadActual);
            presuArt.cantidad = presuArt.cantidadActual;
            this.currentIngresoMercaderia!.articulos?.push(presuArt);
          });
        });
    
        console.log("Este es la orden de produccion generada", this.currentIngresoMercaderia);
        this.ingresoService.crear(this.currentIngresoMercaderia)
        this.mostrarConfirmacionPDF=true
} else return
    }

    confirmarGenerarPDF(generar: boolean) {
      if (generar) {
        this.generarPDF();
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
                  { text: `Fecha: ${this.formatearFecha(this.fechaIngresoMercaderia)}`, style: 'caption', alignment: 'left' },
                  { text: `Taller: ${this.currentTaller?.razonSocial}`, style: 'caption', alignment: 'left' },
                  { text: `Dirección: ${this.currentTaller?.direccion}`, style: 'caption', alignment: 'left' },
                  { text: `Teléfono: ${this.currentTaller?.telefono}`, style: 'caption', alignment: 'left' },
                ]
              },
              {
                width: 'auto',
                stack: [
                  {
                    image: imagenBase64,
                    fit: [120, 60],
                    alignment: 'center',
                  },
                  { text: 'Loria 1140 - Lomas de Zamora', style: 'caption', alignment: 'center' },
                  { text: 'Teléfono: 11-6958-2829', style: 'caption', alignment: 'center' }
                ]
              }
            ]
          },
          {
            text: 'Ingreso de Mercadería',
            style: 'header',
            margin: [0, 20, 0, 10]
          }
        ],
        styles: this.getStyles(),
      };
    
      const tablaBody = [
        [
          { text: 'Código', style: 'tableHeader' },
          { text: 'Cantidad', style: 'tableHeader' },
          { text: 'Descripción', style: 'tableHeader' }
        ]
      ];
    
      this.mapaPresupuestoArticulos?.forEach((presupuestosArticulos, clave) => {
        const cantidades = presupuestosArticulos.map(pa => pa.cantidadActual || 0);
        const totalCantidad = cantidades.reduce((acc, c) => acc + c, 0);
        const descripcion = presupuestosArticulos[0].articulo?.descripcion || '';
        const descripcionCompleta = presupuestosArticulos
          .map(pa => `${pa.cantidadActual || 0}${pa.articulo?.color?.codigo || ''}`)
          .join(' ');
    
        tablaBody.push([
          { text: clave, style: 'tableCell' },
          { text: totalCantidad.toString(), style: 'tableCell' },
          { text: `${descripcion} ${descripcionCompleta}`, style: 'tableCell' }
        ]);
      });
    
      docDefinition.content.push({
        table: {
          headerRows: 1,
          widths: [80, 60, '*'],
          body: tablaBody
        },
        layout: 'lightHorizontalLines',
        style: 'table'
      });
    
      // Generar el PDF
      pdfMake.createPdf(docDefinition).download(`Ingreso-de-mercaderia-${this.currentTaller?.razonSocial}_${new Date().toISOString().split('T')[0]}.pdf`);
    }

    generarPDFcontrolPendientes() {
      if (this.mapaArticulosModificados?.size === 0) {
        alert("No hay ningún pedido producción con estado EN TALLER que tenga artículos para modificar");
        return;
      }
      
      console.log(this.mapaArticulosModificados);
    
      if (!this.mapaArticulosModificados || this.mapaArticulosModificados.size === 0) {
        console.log("No hay datos para generar el PDF.");
        return;
      }
    
      const docDefinition: any = {
        content: [
          {
            columns: [
              {
                width: '*',
                stack: [
                  { text: `Fecha: ${this.formatearFecha(this.fechaIngresoMercaderia)}`, style: 'caption', alignment: 'left' },
                  { text: `Taller: ${this.currentTaller?.razonSocial}`, style: 'caption', alignment: 'left' },
                  { text: `Dirección: ${this.currentTaller?.direccion}`, style: 'caption', alignment: 'left' },
                  { text: `Teléfono: ${this.currentTaller?.telefono}`, style: 'caption', alignment: 'left' },
                ]
              },
              {
                width: 'auto',
                stack: [
                  {
                    image: imagenBase64,
                    fit: [150, 85],
                    alignment: 'center',
                  },
                  { text: 'Loria 1140 - Lomas de Zamora', style: 'caption', alignment: 'center' },
                  { text: 'Teléfono: 11-6958-2829', style: 'caption', alignment: 'center' }
                ]
              }
            ]
          },
          {
            text: 'Control de Pendientes',
            style: 'header',
            margin: [0, 20, 0, 10]
          }
        ],
        styles: this.getStyles(),
      };
    
      const tablaBody = [
        [
          { text: 'Pedido de Producción', style: 'tableHeaderControl' },
          { text: 'Artículo', style: 'tableHeaderControl' },
          { text: 'Pendiente Antes', style: 'tableHeaderControl' },
          { text: 'Descontado', style: 'tableHeaderControl' },
          { text: 'Pendiente Después', style: 'tableHeaderControl' }
        ]
      ];
    
      this.mapaArticulosModificados?.forEach((articulos, clave) => {
        articulos.forEach(articulo => {
          const a = articulo.articuloAfectado;
          const descripcion = `${a?.codigo ?? 'N/A'} ${a?.descripcion ?? 'N/A'} ${a?.color?.codigo ?? 'N/A'}`;
          tablaBody.push([
            { text: clave, style: 'tableCell' },
            { text: descripcion, style: 'tableCell' },
            { text: articulo.pendienteAntes?.toString() ?? '0', style: 'tableCell' },
            { text: articulo.descontado?.toString() ?? '0', style: 'tableCell' },
            { text: articulo.pendienteDespues?.toString() ?? '0', style: 'tableCell' }
          ]);
        });
      });
    
      docDefinition.content.push({
        table: {
          headerRows: 1,
          widths: [80, '*', 60, 60, 60],
          body: tablaBody
        },
        layout: 'lightHorizontalLines',
        style: 'table'
      });
    
      // Generar el PDF
      pdfMake.createPdf(docDefinition).download(`Control-Pendientes-${this.currentTaller?.razonSocial}_${new Date().toISOString().split('T')[0]}.pdf`);
      console.log("PDF generado exitosamente");
    
      this.actualizarPedidosProduccion();
    }
    


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
    tableHeaderControl:{
      bold: true,
      fontSize: 11,
      color: 'white',
      fillColor: '#2C3E50',
      alignment: 'center',
      margin: [0, 6, 0, 6]
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
  window.location.reload();
}





validarDatosRequeridos(): boolean {
  console.log("ESTE ES EL TALLER ACTUAL", this.currentTaller)
  if (!this.currentTaller || Object.keys(this.currentTaller).length === 0 ) {
    console.log("entra al if")
    alert('Debe seleccionar un taller.');
    return true;
  }

  if (!this.mapaPresupuestoArticulos || this.mapaPresupuestoArticulos.size === 0) {
    alert('Debe agregar al menos un artículo al presupuesto.');
    return true;
  }

  return false;
}


cargarDetallesIngresoMercaderia(id: Number) {
  this.ingresoService.get(id).subscribe({
    next: (data) => {
      console.log(data);
      this.ingresoMercaderiaAAcceder = data;
      console.log("El presupuesto cargado es: ", this.ingresoMercaderiaAAcceder);
      this.currentTaller = this.ingresoMercaderiaAAcceder?.taller;
      this.fechaIngresoMercaderia = this.ingresoMercaderiaAAcceder.fecha
      console.log("Se cargó al taller que se buscó acceder ", this.currentTaller);

      // Llamar a procesarMapaDeArticulos cuando los datos se hayan cargado
      this.procesarMapaDeArticulos();
      this.actualizarDataSource()
    },
    error: (e) => console.error(e)
  });
}


procesarMapaDeArticulos() {
  if(this.ingresoMercaderiaAAcceder)
  this.mapaPresuXArtParaAcceder = new Map()
  console.log(this.ingresoMercaderiaAAcceder?.articulos)
  this.ingresoMercaderiaAAcceder?.articulos?.forEach(presuArt => {
  console.log("PRESUART CARGANDO",presuArt)
  console.log("EL CODIGO ARTICULO ES:", presuArt.articulo?.codigo)

    let key
    if(presuArt.articulo?.codigo == 'GEN'){
      console.log("ENTRÓ AL IF")
      key = presuArt.codigo!
    } else {key = presuArt.articulo?.codigo!;}
    console.log("la key es:", key)

    if (this.mapaPresuXArtParaAcceder?.has(key)) {
      const listaDePresuArtActualizada = (this.mapaPresuXArtParaAcceder.get(key) || []);
      listaDePresuArtActualizada.push(presuArt);
      this.mapaPresuXArtParaAcceder.set(key, listaDePresuArtActualizada);

    } else {
      this.mapaPresuXArtParaAcceder?.set(key, [presuArt]);
    } 

    this.mapaPresupuestoArticulos = new Map();
    this.actualizarMapaPresupuestoArticulo(this.mapaPresuXArtParaAcceder!);
    console.log("Este es el presupuesto con articulos a acceder",   this.mapaPresupuestoArticulos)
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
  this.actualizarDataSource()
}

cantidadActualDepoducto():string {
  if (this.currentArticulo) {
  const claveMapa: string = this.currentArticulo?.codigo!;
    
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
    this.currentArticulo = this.articulos[this.articuloColorIndex!]; // Actualiza el artículo seleccionado
    setTimeout(() => {
      if (this.inputCantidad) {
        this.inputCantidad.nativeElement.focus();
      }
    });
  }
}


filtrarIngresosXFecha(){
  if(this.fechaIngresoMercaderia){
    console.log(this.fechaIngresoMercaderia)
  this.ingresosMercaderiaXTallerFiltrados=this.ingresosMercaderiaXTaller.filter(ingreso=>this.formatearFecha(ingreso.fecha) == this.formatearFecha(this.fechaIngresoMercaderia))
}else this.ingresosMercaderiaXTaller = this.ingresosMercaderiaXTaller

}

aplicarIngresoAPedidosProduccion(){


    this.ordenProduccionService.getByTaller(this.currentTaller?.id).subscribe({
      next: (data) => {
        console.log(data);
        this.pedidosProduccionXTaller = data;
        console.log("Taller que se buscó pedidos de producción ", this.currentTaller);
        console.log("Los pedidos de producción son los siguientes: ", this.pedidosProduccionXTaller);
        this.aclararProductoPendentesDisminuidos();
      },
      
      error: (e) => console.error(e)
    });

}

aclararProductoPendentesDisminuidos() {

  if (!this.currentIngresoMercaderia || !this.pedidosProduccionXTaller) return;

  // Ordenar pedidos por fecha (de más antiguo a más reciente)
  this.pedidosProduccionXTaller.sort((a, b) => (new Date(a.fecha!).getTime()) - (new Date(b.fecha!).getTime()));
  const pedidosAAgregarIngresos = this.pedidosProduccionXTaller.filter(pedido=>pedido.idEstadoPedidoProduccion == 2)


  for (let articuloIngreso of this.currentIngresoMercaderia.articulos ?? []) {
  

    let cantidadRestante = articuloIngreso.cantidad;
    let cantidadInicial = cantidadRestante; // Cantidad inicial ingresada

    for (let pedidoProduccion of pedidosAAgregarIngresos) {

      let articuloADescontar = (pedidoProduccion.articulos ?? []).find(presuArt => presuArt.articulo!.id == articuloIngreso.articulo?.id);
      if(!articuloADescontar || articuloADescontar.cantidadPendiente == 0){continue}

      let cantidadPendienteAntes = articuloADescontar.cantidadPendiente ?? 0;
      let cantidadADescontar = Math.min(cantidadPendienteAntes, cantidadRestante!);
      let cantidadPendienteDespues = cantidadPendienteAntes - cantidadADescontar;


      cantidadRestante! -= cantidadADescontar; // Reducimos la cantidad restante

      const key = `#${pedidoProduccion.id} - ${this.formatearFecha(pedidoProduccion.fecha!)}`
      const nuevoValor ={
        articuloAfectado : articuloIngreso.articulo,
        pendienteAntes: cantidadPendienteAntes,
        descontado: cantidadADescontar,
        pendienteDespues: cantidadPendienteDespues,
        idPedidoProduccion: pedidoProduccion.id,
        cantidadPedidaOriginal : articuloADescontar.cantidad,
        hayStock : this.noTienePendientes(cantidadPendienteDespues)
      }
      
      if (!this.mapaArticulosModificados!.has(key)) {
        // Si el pedido no existe, lo creamos con una nueva lista
        this.mapaArticulosModificados!.set(key, [nuevoValor]);
    } else {
        // Si ya existe, agregamos el nuevo artículo a la lista existente
        this.mapaArticulosModificados!.get(key)?.push(nuevoValor);
    }
    
    if (cantidadRestante! <= 0) break;
}


      // Si ya no queda más cantidad por descontar, salir del bucle
    }


    const mapaOrdenado = new Map(
      Array.from(this.mapaArticulosModificados!.entries()).sort(([keyA], [keyB]) => {
        const numA = parseInt(keyA.split(' ')[0].replace('#', ''));
        const numB = parseInt(keyB.split(' ')[0].replace('#', ''));
        return numA - numB;
      })
    );
    
    // Reasignamos el mapa original por el ordenado
    this.mapaArticulosModificados = mapaOrdenado;

    console.log(this.mapaArticulosModificados)

    this.actualizarPedidosProduccion()

  }

  noTienePendientes(unaCantidadPendiente : number): boolean{
    if(unaCantidadPendiente ===0) {return true}
    else return false
  }

  formatearFecha(fecha: any): string {
    const fechaObj = new Date(fecha);
    return isNaN(fechaObj.getTime()) ? 'Fecha inválida' : `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
  }

async actualizarPedidosProduccion() {
  for (const valor of this.mapaArticulosModificados!.values()) {
    console.log("Valor:", valor);

    const ppSeleccionado = this.pedidosProduccionXTaller.find(
      pedidoProduccion => pedidoProduccion.id === valor[0].idPedidoProduccion
    );
    console.log(" ESTE ES EL PEDPROD A MODIFICAR ARTICULOS ", ppSeleccionado)
    if (!ppSeleccionado) continue;

    try {
      if(ppSeleccionado.idPresupuesto){
      const presuAsociado = await firstValueFrom(
        this.presupuestoService.get(ppSeleccionado.idPresupuesto)
      );
      this.presupuestosAModificar.push(presuAsociado);
      console.log("Presupuesto cargado:", presuAsociado);
    } else {console.log("No hay presupuesto asociado")}
    } catch (error) {
      console.error("Error al obtener presupuesto", error);
    }

    for (let registro of valor) {
      ppSeleccionado.articulos = ppSeleccionado.articulos?.filter(
        presuArt => presuArt.articulo?.id !== registro.articuloAfectado?.id
      ) ?? [];

      const articuloActualizado = {
        articulo: registro.articuloAfectado,
        cantidad: registro.cantidadPedidaOriginal,
        cantidadPendiente: registro.pendienteDespues,
        cantidadActual: registro.pendienteDespues,
        cantidadOriginal: registro.cantidadPedidaOriginal,
        hayStock: this.noTienePendientes(registro.pendienteDespues!),
        idPedidoProduccion : registro.idPedidoProduccion,
        codigo: registro.articuloAfectado?.codigo,
        descripcion: registro.articuloAfectado?.descripcion

      };
      ppSeleccionado.articulos.push(articuloActualizado);
    }

    const cantPendientesPP = ppSeleccionado.articulos?.map(a => a.cantidadPendiente);
    if (cantPendientesPP?.every(p => p === 0)) {
      ppSeleccionado.idEstadoPedidoProduccion = 1;
    }

    console.log("Pedido producción actualizado:", ppSeleccionado);
    this.ordenProduccionService.actualizar(ppSeleccionado).subscribe((id: number) => {  
      console.log('🔄 Orden de pedido actualizada con ID:', id);
    }, error => {
      console.error('❌ Error al actualizar la orden de pedido:', error);
    });
    console.log("Pedido producción actualizado")
  }

  // Asegurate que esto se ejecute después de cargar todos los presupuestos
  this.actualizarPresupuestos();
}



actualizarPresupuestos(){
    console.log("ENTRO A LA FUNCION ACTUALIAR PRESU")
  for (const valor of this.mapaArticulosModificados!.values()) {
    console.log("Valor:", valor);
    const ppSeleccionado = this.pedidosProduccionXTaller.find(pedidoProduccion=>pedidoProduccion.id===valor[0].idPedidoProduccion)
    console.log("estos son los presu a modificar", this.presupuestosAModificar.map(presu=> presu.id))
    const presuSeleccionado = this.presupuestosAModificar.find(presupuesto=>presupuesto.id===ppSeleccionado?.idPresupuesto)
    console.log("EL PRESU SELECCIONADO",presuSeleccionado)
    if (!presuSeleccionado) continue;
    console.log(" ENTRÓ AL IF ")
    for(let registro of valor){
      presuSeleccionado.articulos = presuSeleccionado!.articulos?.filter(
        presuArt => presuArt.articulo?.id !== registro.articuloAfectado?.id
      );

      const articuloActualizado = {
        articulo: registro.articuloAfectado,
        cantidad: registro.cantidadPedidaOriginal,
        cantidadPendiente: registro.pendienteDespues,
        hayStock: this.noTienePendientes(registro.pendienteDespues!)
      }
      presuSeleccionado?.articulos?.push(articuloActualizado)  
    }
    console.log("YA PUSHEO EL NUEVO ARTICULO ACTUALIZADO")
    const stockDeArticulos = presuSeleccionado?.articulos?.map(articulo => articulo.hayStock);
    if (stockDeArticulos?.every(hayStock => hayStock === true)) {
      presuSeleccionado!.estadoPresupuesto = new EstadoPresupuesto(4);
      } else presuSeleccionado!.estadoPresupuesto = new EstadoPresupuesto(3);
    console.log("ACTUALIZANDO EL PRESU")
    console.log("EL PRESUPUESTO SE A ACTUALIZADO", presuSeleccionado)
    this.presupuestoService.actualizar(presuSeleccionado!)

  }

}


getArticulosParaArticulo(codigo: string): PresupuestoArticulo[] {
  const item = this.dataSourceCodigo.find(el => el.codigo === codigo);
  return item?.articulos || [];
}

getDescripcionBase(codigo: string): string {
  const entry = this.mapaPresupuestoArticulos?.get(codigo);
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


actualizarDataSource() {
  this.dataSourceCodigo = Array.from(this.mapaPresupuestoArticulos!.entries()).map(([codigo, articulos]) => {
    return {
      codigo,
      descripcion: articulos[0].descripcion,
      articulos // 👈 esto es clave para acceder después a los datos
    };
  });
  console.log(this.dataSourceCodigo)

}

agregarComentario() {
  // Datos iniciales para el diálogo, pueden ser vacíos o con valores por defecto
  const dataInicial = {
    codigo: "MEN",
    descripcion: '',
    precioUnitario: 0,
    cantidad: 1,
    // podrías agregar más campos si quieres editar color, código, etc.
  };
  const dialogRef = this.dialog.open(EditarGenericoDialogIngresoComponent, {
    width: '350px',
    data: dataInicial
  });

  dialogRef.afterClosed().subscribe(result => {
    if(this.mapaPresupuestoArticulos?.has(dataInicial.codigo)){
      const cantDeMensajes = Array.from(this.mapaPresupuestoArticulos.entries())
      .filter(([codigo, lista]) => codigo.startsWith('MEN')) // Filtra las entradas cuyas claves empiezan con 'MEN'
      .map(([codigo, lista]) => lista).length; // Mapea para quedarte solo con el array de artículos/mensajes

      dataInicial.codigo = dataInicial.codigo + String((cantDeMensajes ?? 0) + 1);
    }
    if (result) {
      // Construimos el Articulo
      const nuevoArticulo = new Articulo();
      nuevoArticulo.id = 0;
      nuevoArticulo.codigo="GEN"
      nuevoArticulo.descripcion="GENERICO"
      nuevoArticulo.color = {id:37, codigo:"GN", descripcion:"GENERICO"}
      nuevoArticulo.medida = {id:0, codigo:"GEN", descripcion:"GENERICO"}
      nuevoArticulo.articuloPrecio={id:0, codigo:"GEN", descripcion:"GENERICO", precio1:0}
      

      // Construimos el PresupuestoArticulo que incluye el Articulo y otros campos
      const nuevoPresupuestoArticulo = new PresupuestoArticulo();
      nuevoPresupuestoArticulo.articulo = nuevoArticulo;
      nuevoPresupuestoArticulo.cantidad = result.cantidad;
      nuevoPresupuestoArticulo.cantidadActual = 0;
      nuevoPresupuestoArticulo.precioUnitario = result.precioUnitario;
      nuevoPresupuestoArticulo.descripcion = result.descripcion;
      nuevoPresupuestoArticulo.codigo = dataInicial.codigo;
      console.log(nuevoPresupuestoArticulo)
      // agregar descuento, stock, presupuesto si hace falta

      dataInicial.codigo = "MEN"

      console.log(this.mapaPresupuestoArticulos)

      this.guardarPresupuestoArticulo(nuevoPresupuestoArticulo);
    }
  });

}

guardarPresupuestoArticulo(pa: PresupuestoArticulo) {

  this.mapaPresupuestoArticulos?.set(pa.codigo!, [pa]);
  this.actualizarDataSource()

}

}

@Component({
  selector: 'app-editar-generico-dialog',
  templateUrl: './editar-generico-dialog.component.html',
})
export class EditarGenericoDialogIngresoComponent {
  constructor(
    public dialogRef: MatDialogRef<EditarGenericoDialogIngresoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { descripcion: string; precio: number }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    this.dialogRef.close(this.data);
  }
}





