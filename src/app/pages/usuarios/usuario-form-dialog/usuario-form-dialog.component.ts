import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';

const ROLES = ['ADMIN', 'CONTROL', 'ARMADO', 'TALLER', 'CONTROL_FINANZAS'];

@Component({
  selector: 'app-usuario-form-dialog',
  templateUrl: './usuario-form-dialog.component.html'
})
export class UsuarioFormDialogComponent {

  roles = ROLES;

  form: FormGroup<any>;

  constructor(
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<UsuarioFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean, user?: Usuario }
  ) {

    this.form = new FormGroup<any>({
      userName: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      rol: new FormControl('', Validators.required),
      password: new FormControl('') // Solo se usa al crear
    });

    // Si es edición -> cargar datos y quitar password
    if (data?.isEdit && data.user) {
      this.form.patchValue({
        userName: data.user.userName,
        nombre: data.user.nombre,
        apellido: data.user.apellido,
        rol: data.user.rol,
      });
      this.form.removeControl('password');
    }
  }

  save() {
    if (this.form.invalid) return;

    const usuario: Usuario = {
      userName: this.form.get('userName')!.value,
      nombre: this.form.get('nombre')!.value,
      apellido: this.form.get('apellido')!.value,
      rol: this.form.get('rol')!.value
    };

    if (this.data.isEdit) {

      // ✅ update(id, usuario)
      this.usuarioService.update(usuario)
        .subscribe(() => this.dialogRef.close(true));

    } else {

      // ✅ password solo en creación
      const password = this.form.get('password')!.value ?? '';
      usuario.contrasenia = password;
      this.usuarioService.create(usuario)
        .subscribe(() => this.dialogRef.close(true));
    }
  }
}
