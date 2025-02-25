import { Component } from '@angular/core';
import { Articulo } from 'src/app/models/articulo.model';
import { Cliente } from 'src/app/models/cliente';
import { ArticuloService } from 'src/app/services/articulo.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-search-budget',
  templateUrl: './search-budget.component.html',
  styleUrls: ['./search-budget.component.css']
})
export class SearchBudgetComponent {
//DATOS DEL PRESUPUESTO
currentCliente?: Cliente;
fechaPresupuesto ='';

  
  clientes?: Cliente[];
  articulos?: Articulo[];
  currentIndex = -1;
  producto = '';
  numCliente = '';
  mostrarColores = false;
  codigoArticulo = '';
  familiaMedida: string[] = [];

  constructor(private clienteService: ClienteService, private articuloService:ArticuloService) {}

  ngOnInit(): void {
    this.listarClientes();
    this.fechaPresupuesto = new Date().toISOString().split('T')[0];
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
    console.log('pasoooo');
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
  
}


