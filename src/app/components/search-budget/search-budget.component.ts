import { Component } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/service/cliente.service';

@Component({
  selector: 'app-search-budget',
  templateUrl: './search-budget.component.html',
  styleUrls: ['./search-budget.component.css']
})
export class SearchBudgetComponent {
  clientes?: Cliente[];
  currentCliente?: Cliente;
  currentIndex = -1;
  producto = '';
  numCliente = '';
  mostrarColores = false

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.listarClientes();
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


    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.currentCliente = data[0];
        console.log(data[0]);
      },
      error: (e) => console.error(e)
    });

    /*this.clienteService.get(this.numCliente).subscribe({
      next: (data)=>{
      this.currentCliente = data
      console.log(data);
      },
      error: (e) => console.error(e)
  });*/
  }
  

 seleccionarCliente(): void {


  
    // Verificar si target no es null y es un HTMLSelectElement
    //const selectElement = target as HTMLSelectElement;
    //this.currentCliente = cliente;
    
    console.log('passo');
    console.log (this.currentIndex);
    if(this.clientes){
      console.log(this.clientes[this.currentIndex-1]);
      this.currentCliente = this.clientes[this.currentIndex-1];
    }
      
  }

  mostrarVariedadColores(){
    this.mostrarColores=true;
  }
  
}


