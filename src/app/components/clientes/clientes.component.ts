import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, startWith, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {


  clientes?: Cliente[];
  
  
  currentCliente?: Cliente
  fechaPresupuesto ?:string;
  idCliente = '';
  currentIndex = -1;
  mostrarPanelBusqueda = false;
  mostrarPanelCreacion = false;
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>= new Observable<string[]>();
  clienteSeleccionado = ''



  constructor(private clienteService : ClienteService, private router : Router) {}



  ngOnInit(): void {
    this.listarClientes();
    this.fechaPresupuesto =  new Date().toISOString().split('T')[0];;

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }
  
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  listarClientes(): void {

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
        this.options = this.clientes.map(cliente=>cliente.razonSocial ?? '')
        console.log(this.options)
      },
      error: (e) => console.error(e)
      
    });
  }

  buscarCliente(){
    console.log("se ejecutó el método")
    console.log(this.clienteSeleccionado)
    if(this.clienteSeleccionado){
     const clienteBuscado = this.clientes?.find(cliente=> cliente.razonSocial == this.clienteSeleccionado);
     console.log(clienteBuscado)
     this.clienteService.get(clienteBuscado?.id).subscribe({
      next: (data) => {
        this.currentCliente = data;
        console.log(this.currentCliente);
        console.log(data)
      },
      error: (e) => console.error(e)

    });
    } 
    else if(this.idCliente){
     this.clienteService.get(this.idCliente).subscribe({
      next: (data) => {
        this.currentCliente = data;
        console.log(this.currentCliente);
        console.log(data)
      },
      error: (e) => console.error(e)

    });
    }
  }

  actualizarCliente(){
    if(this.currentCliente){
      console.log("CLIENTE A ACTUALIZAR ", this.currentCliente); // Mostrar el cliente a actualizar
      this.clienteService.actualizar(this.currentCliente)
    }
    else alert("no se pudo actualizar al cliente")
}


}
