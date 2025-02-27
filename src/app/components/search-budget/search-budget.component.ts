import { Component } from '@angular/core';
import { Articulo } from 'src/app/models/articulo.model';
import { Cliente } from 'src/app/models/cliente';
import { Medida } from 'src/app/models/medida.model';
import { PresupuestoArticulo } from 'src/app/models/presupuesto-articulo.model';
import { Presupuesto } from 'src/app/models/presupuesto.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import { PresupuestoService } from 'src/app/services/budget.service';
import { ClienteService } from 'src/app/services/cliente.service';

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
  mostrarColores = false;
  eximirIVA = false;
  currentIndex = -1;
  articuloColorIndex = -1;
 

  constructor(private clienteService: ClienteService, private articuloService:ArticuloService, private presupuestoService:PresupuestoService) {}

  ngOnInit(): void {
    this.listarClientes();
    this.fechaPresupuesto =  new Date().toISOString().split('T')[0];;
    this.mapaPresupuestoArticulos=new Map();
  
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

  mostrarVariedadColores(){
    
    this.articulos = [];
    //resultado: string[] = [];
    console.log('viene con ' + this.codigoArticulo);
   if(this.codigoArticulo){   
    this.familiaMedida = this.codigoArticulo.split('/');
    console.log(this.familiaMedida);
   this.articuloService.getByFamiliaMedida(this.familiaMedida[0],this.familiaMedida[1]).subscribe({
    next: (data) => {
      this.articulos = data;
    },
    error: (e) => console.error(e)
  });  
  console.log(this.articulos);
  if(this.articulos)
    this.mostrarColores=true;
  else
     this.mostrarColores=false;  
}else
    this.mostrarColores=false;    
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
    
      pa.push({articulo: this.currentArticulo,cantidad: Number(this.cantProducto)});

      this.mapaPresupuestoArticulos?.set(claveMapa,pa);

      console.log(this.mapaPresupuestoArticulos);
           
    }
  }

  getCantidadTotal(presupuestoArticulos: PresupuestoArticulo[]): number {
    return (presupuestoArticulos
      .map(articulo => articulo.cantidad)  // Extrae la propiedad 'cantidad'
      .reduce((total, cantidad) => (total || 0) + (cantidad || 0), 0) || 0) ;  // Suma las cantidades
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

}




