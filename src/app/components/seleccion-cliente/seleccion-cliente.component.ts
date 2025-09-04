import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-seleccion-cliente',
  templateUrl: './seleccion-cliente.component.html',
  styleUrls: ['./seleccion-cliente.component.css']
})
export class SeleccionClienteComponent {


// MAT TABLE INFO
displayedClienteColumns: string[] = ['razonSocial', 'telefono', 'domicilio', 'localidad', 'cuit', 'editar'];
clienteDataSource?: MatTableDataSource<Cliente>;
@ViewChild(MatSort) sort!: MatSort;

constructor(
  private router: Router,
  private clienteService: ClienteService
) {}

ngOnInit() {
  this.listarClientes();
}

generarCliente() {
  this.router.navigate(['/clientes']); 
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.clienteDataSource!.filter = filterValue.trim().toLowerCase();
}

listarClientes() {
  this.clienteService.getAll().subscribe({
    next: (clientes) => {
      console.log(clientes);
      this.clienteDataSource = new MatTableDataSource(clientes);
      this.clienteDataSource.sort = this.sort; // ✅ seteo el sort cuando cargo los datos
    },
    error: (err) => {
      console.error('Error al traer clientes', err);
    }
  });
}

actualizarDataSource(clientes: Cliente[]) {
  if (!this.clienteDataSource) {
    this.clienteDataSource = new MatTableDataSource(clientes);
    if (this.sort) this.clienteDataSource.sort = this.sort;
  } else {
    this.clienteDataSource.data = clientes;
  }
}

editarCliente(id: number) {
  console.log('Cliente a editar:', id);

  // Ejemplo: redirigir a la página de edición del cliente
  this.router.navigate([`/clientes/${id}`]);
}


}

