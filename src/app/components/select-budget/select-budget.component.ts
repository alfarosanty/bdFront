import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Presupuesto } from 'src/app/models/presupuesto.model';
import { PresupuestoService } from 'src/app/services/budget.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { SearchBudgetService } from 'src/app/services/search-budget.service';

@Component({
  selector: 'app-select-budget',
  templateUrl: './select-budget.component.html',
  styleUrls: ['./select-budget.component.css']
})
export class SelectBudgetComponent {

  clientes?: Cliente[];
  presupuestosXCliente?: Presupuesto[];
  presupuestoSeleccionado ?: Presupuesto;

  clienteBuscado?: String;

  fechaPresupuesto ?:string;
  numCliente = '';
  numPresupuesto = '';
  currentIndex = -1;
  mostrarPanelBusqueda = false


  constructor(private clienteService : ClienteService,private budgetService : PresupuestoService, private router : Router, private presupuestoController : PresupuestoController) {}



  ngOnInit(): void {
    this.listarClientes();
    this.fechaPresupuesto =  new Date().toISOString().split('T')[0];;

  }


  listarClientes(): void {

    this.clienteBuscado = '';
    this.currentIndex = -1;
    this.clienteService.getAll().pipe(
      catchError(error => {
        // Manejo del error
        console.error('Ocurrió un error:', error);
        alert('No se puede obtener los datos provenientes de la base de datos (ERROR DE IP)');
        return throwError(() => new Error('Hubo un problema al obtener los clientes.'));
      })
    ).subscribe({
      next: (data) => {
        this.clientes = data;
        console.log(data);
      },
      error: (e) => console.error(e)
      
    });
  }

  generarPresupuesto(){

    this.router.navigate(['/searchBudget']); // Redirige a la ruta '/presupuesto'

  }

  buscarPresupuestosXCliente(){
    if(this.clienteBuscado){
     const clienteSeleccionado = this.clientes?.find(cliente=> cliente.razonSocial == this.clienteBuscado);
     this.presupuestosXCliente = this.presupuestoController.get(clienteSeleccionado?.id);
    }
  }

  buscarPresupuestoXNumero(){

    this.presupuestoSeleccionado = this.presupuestoController.get(this.numPresupuesto);

  }
  }

