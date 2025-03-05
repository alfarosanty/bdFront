import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { Articulo } from 'src/app/models/articulo.model';
import { Cliente } from 'src/app/models/cliente';
import { Medida } from 'src/app/models/medida.model';
import { PresupuestoArticulo } from 'src/app/models/presupuesto-articulo.model';
import { Presupuesto } from 'src/app/models/presupuesto.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import { PresupuestoService } from 'src/app/services/budget.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { jsPDF }  from 'jspdf';
import  autoTable  from 'jspdf-autotable';





@Component({
  selector: 'app-search-budget',
  templateUrl: './search-budget.component.html',
  styleUrls: ['./search-budget.component.css']
})
export class SearchBudgetComponent {
//DATOS DEL PRESUPUESTO

  clientes?: Cliente[];
  articulos: Articulo[]=[];
  familiaMedida: string[] = [];
  mapaPresupuestoArticulos ?: Map<string,PresupuestoArticulo[]>;


  currentCliente?: Cliente;
  currentArticulo ?: Articulo;

  fechaPresupuesto ?:string;
  producto = '';
  numCliente = '';
  codigoArticulo = '';
  cantProducto = '';
  descUnitario = '';
  descTotal = '';
  mostrarColores = false;
  eximirIVA = false;
  currentIndex = -1;
  articuloColorIndex = -1;

  //INPUT BUSQUEDA
  myControl = new FormControl();
  options: string[] = [];
filteredOptions: Observable<string[]>= new Observable<string[]>();
articuloSeleccionado ='';
 //END INPUT

  constructor(private clienteService: ClienteService, private articuloService:ArticuloService, private presupuestoService:PresupuestoService) {}

  ngOnInit(): void {
    this.listarClientes();
    this.fechaPresupuesto =  new Date().toISOString().split('T')[0];;
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

    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''),map(value => this._filter(String(value))));

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  listarClientes(): void {

    this.currentCliente = {};
    this.currentIndex = -1;

    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  seleccionarXnumeroCliente() {
     this.clienteService.get(this.numCliente).subscribe({
      next: (data) => {
        this.currentCliente = data;
        console.log(this.currentCliente);
      },
      error: (e) => console.error(e)

    });
  }
  

 seleccionarCliente(): void {
    console.log('passo');
    console.log (this.currentIndex);
    if(this.clientes){
      console.log(this.clientes[this.currentIndex-1]);
      this.currentCliente = this.clientes[this.currentIndex-1];
    }
      
  }

  convertirAMayuscula(){
    this.codigoArticulo = this.codigoArticulo.toUpperCase();
  }

  seleccionarArticulo(){
    const codigoAritculoSeleccionado = this.articuloSeleccionado.split(' ');
    this.codigoArticulo = codigoAritculoSeleccionado[0];
    this.mostrarVariedadColores();


  }

  mostrarVariedadColores() {
    this.articulos = [];
    console.log('viene con ' + this.codigoArticulo);
  
    // Verifica si hay un código de artículo
    if (this.codigoArticulo) {
      // Separa el código en familia y medida
      this.familiaMedida = this.codigoArticulo.split('/');
  
      // Llama al servicio para obtener artículos según la familia y medida
      this.articuloService.getByFamiliaMedida(this.familiaMedida[0], this.familiaMedida[1]).subscribe({
        next: (data) => {
          this.articulos = data;
          console.log("Volvió de la base con " + this.articulos.length + " artículos."); 
            // Remover colores ya cargados
          var idspa = this.mapaPresupuestoArticulos?.get(this.codigoArticulo)?.map(pa => pa.articulo?.id);
  
          if (idspa) {
            this.articulos = this.articulos.filter(articulo => !(idspa?.includes(articulo.id)));
          }
  
          // Mostrar u ocultar colores según si hay artículos disponibles
          this.mostrarColores = this.articulos.length > 0;
          console.log('mostrarColores:', this.mostrarColores);
        },
        error: (e) => console.error('Error al obtener artículos:', e)
      });
  
    } else {
      // Si no hay código de artículo, ocultar los colores
      this.mostrarColores = false;
      console.log('No hay código de artículo. mostrarColores:', this.mostrarColores);
    }
  }
  

  mostrarColoresDisponibles(articulo : Articulo) : string {
    return (articulo.color?.descripcion || "");
    }
  
  
agregarArticulo(){
  console.log (this.articuloColorIndex);
  if(this.articulos){
    this.currentArticulo = this.articulos[this.articuloColorIndex];
    this.articulos = this.articulos.filter(articulo => articulo.id !== this.currentArticulo?.id);

  }

    if(this.currentArticulo){
    const claveMapa :string = this.currentArticulo?.familia?.codigo + "/" + this.currentArticulo.medida?.codigo;
    console.log(claveMapa)


    var pa :PresupuestoArticulo[] = [];

    if(this.mapaPresupuestoArticulos?.has(claveMapa))
      pa  = this.mapaPresupuestoArticulos.get(claveMapa) as PresupuestoArticulo[]
    
      pa.push({articulo: this.currentArticulo,cantidad: Number(this.cantProducto), PrecioUnitario: this.currentArticulo.precio1});

      this.mapaPresupuestoArticulos?.set(claveMapa,pa);

      console.log(this.mapaPresupuestoArticulos);
           
    }
  }

  getCantidadTotal(presupuestoArticulos: PresupuestoArticulo[]): number {
    return (presupuestoArticulos
      .map(articulo => articulo.cantidad)  // Extrae la propiedad 'cantidad'
      .reduce((total, cantidad) => (total || 0) + (cantidad || 0), 0) || 0) ;  // Suma las cantidades
  }

  aplicarDescuentoUnitario(key : any){
    
  var pa :PresupuestoArticulo[] = [];

  pa =  this.mapaPresupuestoArticulos?.get(key) as PresupuestoArticulo[]

  pa.forEach(presupuesto =>{presupuesto.descuento = Number(this.descUnitario)})

  }

  calcularPrecioConDescuento(presupuestoArticulo: any): number {
    return (presupuestoArticulo.PrecioUnitario - (presupuestoArticulo.PrecioUnitario * ((presupuestoArticulo.descuento || 0) * 0.01)));
  }

  borrarFila(key : any){
    
    this.mapaPresupuestoArticulos?.delete(key);
  
    }


  calcularPrecioSubtotal() : number{
      if (this.mapaPresupuestoArticulos) {
        // Aplana las listas de artículos
        let presupuestosArticulos = Array.from(this.mapaPresupuestoArticulos.values()).flatMap(Lista => Lista);
    
        // Obtén solo los precios de los artículos
        let preciosDePresupuestos = presupuestosArticulos.map(presupuestoArticulo => (this.calcularPrecioConDescuento(presupuestoArticulo)) * (presupuestoArticulo.cantidad || 0));
        console.log(preciosDePresupuestos);
    
        // Suma los precios para obtener el subtotal
        let subtotalDePrecios = preciosDePresupuestos.reduce((acumulador, precio) => {
          return (acumulador || 0) + (precio || 0);  // Suma los precios al acumulador
        }, 0);
    
        return subtotalDePrecios; 
      }
    
      return 0; 
    }


  calcularPrecioTotal() : number{

    var descuento = 0.01 * Number(this.descTotal)
    return this.calcularPrecioSubtotal() - (this.calcularPrecioSubtotal() * descuento )
    }
    
  
  guardarPresupuesto(){
    const presupuesto = new Presupuesto();
    presupuesto.Cliente = this.currentCliente;
    presupuesto.EximirIVA = this.eximirIVA;
    presupuesto.Articulos = [];
    if(this.fechaPresupuesto)
        presupuesto.Fecha = new Date(this.fechaPresupuesto);


    this.mapaPresupuestoArticulos?.forEach((valor, clave) => {
      console.log(clave);
      console.log('largooo'  + valor.length);
      valor.forEach(presuArt => {
        console.log(presuArt.articulo?.color?.descripcion + '' +presuArt.cantidad);
        presupuesto.Articulos?.push(presuArt);      
  })
  
});
    //presupuesto.articulos
    console.log(presupuesto.Articulos?.length);
  const idPresupuesto = this.presupuestoService.guardar(presupuesto);
  if(idPresupuesto){
    //reiniciar el formulario
    //mostrar el Numero de presupuesto generado
    alert(idPresupuesto);
  }
}



generarPDF() {
  const doc = new jsPDF();

  // Encabezado
  doc.setFontSize(16);
  doc.text('Presupuesto', 10, 10);
  doc.setFontSize(12);
  doc.text(`Fecha: ${this.fechaPresupuesto}`, 10, 20);
  
  if (this.currentCliente) {
    doc.text(`Cliente: ${this.currentCliente.razonSocial}`, 10, 30);
    doc.text(`Dirección: ${this.currentCliente.domicilio}`, 10, 40);
    doc.text(`Teléfono: ${this.currentCliente.telefono}`, 10, 50);
  }

  // Datos de los artículos
  const columnas = ['Código', 'Cantidad', 'Descripción', 'Precio Unitario', 'Subtotal'];
  const filas: any[] = [];

  this.mapaPresupuestoArticulos?.forEach((articulos, clave) => {
    articulos.forEach((presuArt) => {
      filas.push([
        clave,
        presuArt.cantidad,
        (presuArt.articulo?.descripcion || "") + (presuArt.cantidad || 0) + presuArt.articulo?.color?.codigo,
        (presuArt.PrecioUnitario || 0).toFixed(2),
        (this.calcularPrecioConDescuento(presuArt) * (presuArt.cantidad || 0)).toFixed(2)
      ]);
    });
  });

  // Dibujar encabezados de la tabla
  let startY = 60; // Posición de inicio para la tabla
  const columnWidths = [30, 30, 80, 40, 40]; // Ancho de cada columna
  doc.setFontSize(10);

  doc.setFillColor(0, 0, 255); // Azul para el fondo
  doc.setTextColor(255, 255, 255); // Blanco para el texto
  doc.setFont('helvetica', 'bold'); // Negrita para el encabezado

  // Encabezados
  columnas.forEach((columna, index) => {
    doc.text(columna, 10 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), startY);
  });

  // Dibujar filas de la tabla con texto negro
  doc.setTextColor(0, 0, 0); // Volver a color de texto negro para el contenido de la tabla
  doc.setFont('helvetica', 'normal'); // Texto normal para las filas

  // Dibujar filas de la tabla
  filas.forEach((fila, index) => {
    startY += 10;
    fila.forEach((valor: string | number, colIndex: number) => { // Añadí los tipos explícitos
      doc.text(valor.toString(), 10 + columnWidths.slice(0, colIndex).reduce((a, b) => a + b, 0), startY);
    });
  });

  // Calcular el total
  const total = String(this.calcularPrecioTotal())

  // Agregar el total debajo de la tabla
  startY += 10; // Espaciado después de la última fila
  doc.text(`Total: $${total}`, 10, startY);

  // Guardar o descargar el PDF
  doc.save(`Presupuesto_${new Date().toISOString().split('T')[0]}.pdf`);
}




}




