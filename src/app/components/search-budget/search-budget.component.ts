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
  currentCliente: Cliente = {};
  currentIndex = -1;
  producto = '';

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

 seleccionarCliente(target: EventTarget | null): void {
    // Verificar si target no es null y es un HTMLSelectElement
    const selectElement = target as HTMLSelectElement;
  
    if (selectElement) {
      const clienteId = selectElement.value;
  
      if (clienteId) {
        this.currentCliente = this.clientes?.find(cliente => cliente.id?.toString() === clienteId) || {};
      } else {
        this.currentCliente = {};  // Si no hay cliente seleccionado, vaciar los detalles
      }
      console.log(this.currentCliente);  // Mostrar los detalles del cliente seleccionado
    }
  }
  
  

}
