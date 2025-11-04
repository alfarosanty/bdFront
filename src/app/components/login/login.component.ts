import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
  constructor(private authService: AuthService, private loginService: LoginService, private router: Router) {}

  onSubmit() {
    this.loginService.login({ userName: this.userName, contrasenia: this.contrasenia })
      .subscribe({
        next: (res) => {
          console.log("RESPONSE QUE ME LLEGA: ", res);
  
          localStorage.setItem('nombre', res.nombre);
          localStorage.setItem('apellido', res.apellido);
          localStorage.setItem('userName', res.userName);
          localStorage.setItem('rol', res.rol);
  
          this.authService.setUser({
            nombre: res.nombre,
            apellido: res.apellido,
            userName: res.userName,
            rol: res.rol
          });
  
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err.error || 'Usuario o contraseña incorrectos';
        }
      });
  }
  

}
