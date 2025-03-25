import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, startWith, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Presupuesto } from 'src/app/models/presupuesto.model';
import { PresupuestoService } from 'src/app/services/budget.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-select-budget',
  templateUrl: './select-budget.component.html',
  styleUrls: ['./select-budget.component.css']
})
export class SelectBudgetComponent {

  clientes?: Cliente[];
  presupuestosXCliente?: Presupuesto[];
  presupuestoSeleccionado ?: Presupuesto;

  fechaPresupuesto ?:string;
  numCliente = '';
  idPresupuesto = '';
  currentIndex = -1;
  mostrarPanelBusqueda = false
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>= new Observable<string[]>();
  clienteSeleccionado = ''



  constructor(private clienteService : ClienteService,private presupuestoService : PresupuestoService, private router : Router) {}



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


  generarPresupuesto(){

    this.router.navigate(['/searchBudget']); // Redirige a la ruta '/presupuesto'

  }

  buscarPresupuestosXCliente(){
    console.log("se ejecutó el método")
    console.log(this.clienteSeleccionado)
    if(this.clienteSeleccionado){
     const clienteBuscado = this.clientes?.find(cliente=> cliente.razonSocial == this.clienteSeleccionado);
     console.log(clienteBuscado)
     this.presupuestoService.getByCliente(clienteBuscado?.id).subscribe({
      next: (data) => {
        this.presupuestosXCliente = data;
        console.log(this.presupuestosXCliente);
        console.log(data)
      },
      error: (e) => console.error(e)

    });
    }
  }

  buscarPresupuestoXNumero(){

    this.presupuestoService.get(this.idPresupuesto).subscribe({
      next: (data) => {
        this.presupuestoSeleccionado = data;
        console.log(this.presupuestoSeleccionado);
      },
      error: (e) => console.error(e)

    });

  }

  accederAPresupuesto() {
    if (this.presupuestoSeleccionado) {
      this.router.navigate(['/searchBudget', this.presupuestoSeleccionado.id]);
    } else {
      alert("No se seleccionó ningún presupuesto.")
      console.log('No se ha seleccionado un presupuesto.');
    }
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
      console.log(fechaFormateada)
      
      return fechaFormateada;
    } else {
      console.log('Fecha inválida o nula');
      return '';
    }
  }
  
  }

