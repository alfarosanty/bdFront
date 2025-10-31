import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  userName = '';
  contrasenia = '';
  error: string = '';
  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    this.loginService.login({ userName: this.userName, contrasenia: this.contrasenia })
      .subscribe({
        next: (res) => {
          // Guardamos rol y nombre en localStorage (para mostrar/ocultar pestañas)
          localStorage.setItem('userName', res.usuario);
          localStorage.setItem('rol', res.rol);

          // Redirigir a home o dashboard
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err.error || 'Usuario o contraseña incorrectos';
        }
      });
  }

}
