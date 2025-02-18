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



}
