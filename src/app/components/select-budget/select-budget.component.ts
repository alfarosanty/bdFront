import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, startWith, throwError } from 'rxjs';
import { Cliente } from 'src/app/models/cliente';
import { Presupuesto } from 'src/app/models/presupuesto.model';
import { PresupuestoService } from 'src/app/services/budget.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstadoPresupuesto } from 'src/app/models/estado-presupuesto.model';

@Component({
  selector: 'app-select-budget',
  templateUrl: './select-budget.component.html',
  styleUrls: ['./select-budget.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class SelectBudgetComponent {

// LISTAS
  clientes?: Cliente[];
  presupuestosXCliente?: Presupuesto[];
  presupuestoSeleccionado ?: Presupuesto|null;
  estadosPresupuesto?: EstadoPresupuesto[];

// OBJETOS ÚNICOS
currentCliente?: Cliente|null


  fechaPresupuesto ?:string;
  numCliente?: number|null=null;
  numPresupuesto?: number|null=null;
  currentIndex = -1;
  mostrarPanelBusqueda = false
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>= new Observable<string[]>();

  // INPUT BÚSQUEDA
  clienteControl = new FormControl();
  filteredClientes: Observable<Cliente[]> = new Observable<Cliente[]>;
  clienteOptions: Cliente[] =[];
  clienteSeleccionado ='';



  constructor(private snackbar : MatSnackBar, private clienteService : ClienteService,private presupuestoService : PresupuestoService, private router : Router) {}



  ngOnInit(): void {
    this.listarClientes();
    this.fechaPresupuesto =  new Date().toISOString().split('T')[0];

    this.presupuestoService.getEstadosPresupuesto().subscribe({
      next: (data) => {
        this.estadosPresupuesto = data;
        console.log(data);

      },
      error: (error) => {
        console.error('Error al cargar estados de presupuesto:', error);
        this.mostrarError('No se pudieron cargar los estados de presupuesto');
      }      
    });

  }

  mostrarError(mensaje: string) {
    this.snackbar.open(mensaje, 'Cerrar', {
      duration: 5000, // ms
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'] // opcional para estilos
    });
  }
  
  private _filterClientes(value: string): Cliente[] {
    const filterValue = value.toLowerCase();
    return this.clientes!.filter(cliente => cliente.razonSocial?.toLowerCase().includes(filterValue))
    .sort((a,b) => a.razonSocial!.localeCompare(b.razonSocial!) );
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
        this.filteredClientes = this.clienteControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterClientes(value || ''))
        );        
        console.log(this.options)
      },
      error: (e) => console.error(e)
      
    });
  }


  generarPresupuesto(){

    this.router.navigate(['/searchBudget']); // Redirige a la ruta '/presupuesto'

  }


  accederAPresupuesto() {
    if (this.presupuestoSeleccionado) {
      this.router.navigate(['/searchBudget', this.presupuestoSeleccionado.id]);
    } else {
      alert("No se seleccionó ningún presupuesto.")
      console.log('No se ha seleccionado un presupuesto.');
    }
  }

  seleccionarPresupuesto(){
    if(this.presupuestoSeleccionado?.estadoPresupuesto?.id === this.estadosPresupuesto?.find(estado=>estado.descripcion==="FACTURADO")?.id){
      this.mostrarError("No puede entrar a separacón de productos un presupuesto facturado")
      return
    }
    if (this.presupuestoSeleccionado) {
      this.router.navigate(['/seleccionarPresupuesto', this.presupuestoSeleccionado.id]);
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
      
      return fechaFormateada;
    } else {
      return '';
    }
  }
  
  
  formatearFecha(fecha: any): string {
    const fechaObj = new Date(fecha);
    return isNaN(fechaObj.getTime()) ? 'Fecha inválida' : `${fechaObj.getDate()}/${fechaObj.getMonth() + 1}/${fechaObj.getFullYear()}`;
  }
  
  mostrarPresupuestoSeleccionado(){
    console.log(this.presupuestoSeleccionado)
  }
  
  
  seleccionarCliente() {
    const valor = this.clienteControl.value;
    console.log('Cliente seleccionado:', valor);
    // Acá podés buscar el objeto completo si necesitás más datos
    this.currentCliente = this.clientes?.find(c => c.razonSocial === valor);
    this.numPresupuesto = null
    this.numCliente = this.currentCliente?.id
    this.seleccionarXnumeroCliente()
    console.log('Objeto cliente:', this.currentCliente);

  }

  seleccionarXnumeroCliente() {
    this.presupuestosXCliente=[]
    this.presupuestoSeleccionado=null
    this.numPresupuesto=null

    console.log(this.numCliente)
    this.currentCliente = this.clientes?.find(c => c.id === this.numCliente);
    this.presupuestoService.getByCliente(this.numCliente).subscribe({
     next: (data) => {
      console.log("Presupuestos de ", this.currentCliente?.razonSocial, ": ", data)
       this.presupuestosXCliente = data;
       this.clienteControl.setValue(this.clientes?.find(cliente=>cliente.id === this.numCliente)?.razonSocial); // <-- Esto lo muestra en el input
     },
     error: (e) => console.error(e)

   });
 }

 seleccionarXnumeroPresupuesto(unNumero: number) {
  
  this.presupuestoService.get(unNumero).subscribe({
    next: (presupuesto) => {
      console.log('Presupuesto encontrado:', presupuesto);
      this.currentCliente = presupuesto.cliente;
      this.numCliente = presupuesto.cliente?.id;
      this.seleccionarXnumeroCliente();
      this.presupuestoSeleccionado = presupuesto;
      this.numPresupuesto = unNumero;
      this.clienteControl.setValue(presupuesto.cliente?.razonSocial);
      console.log(presupuesto);
    },
    error: (err) => {
      if (err.status === 404) {
        this.mostrarError(err.error?.mensaje || 'Presupuesto no encontrado');
      } else {
        this.mostrarError('Error inesperado al buscar presupuesto');
      }
    }
    
  });
  

}

asignarNumeroDePresupuesto(presupuesto: Presupuesto) {
  this.presupuestoSeleccionado = presupuesto;
  this.numPresupuesto = presupuesto?.id ?? null;
}
  }

