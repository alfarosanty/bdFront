import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioFormDialogComponent } from 'src/app/pages/usuarios/usuario-form-dialog/usuario-form-dialog.component';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-list-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrls: ['./list-usuarios.component.css']
})
export class ListUsuariosComponent implements OnInit {

  displayedColumns = ['userName', 'nombre', 'apellido', 'rol', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.usuarioService.getAll().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  agregarUsuario() {
    const dialogRef = this.dialog.open(UsuarioFormDialogComponent, { 
      width: '450px',
      data: { isEdit: false, usuario: null }
    });
    dialogRef.afterClosed().subscribe(ok => ok && this.loadData());
  }
  

  editarUsuario(u: Usuario) {
    const dialogRef = this.dialog.open(UsuarioFormDialogComponent, {
      width: '450px',
      data: { isEdit: true, usuario: u }
    });
    dialogRef.afterClosed().subscribe(ok => ok && this.loadData());
  }
  

  eliminarUsuario(id: number) {
    if (!confirm("¿Seguro que querés eliminar este usuario?")) return;
  
    this.usuarioService.delete(id).subscribe(() => {
      this.loadData();
    });
  }
  
}