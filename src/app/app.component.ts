import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { Usuario } from './models/usuario.model';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Blume';
  user: Usuario | null = null;

  constructor(private authService: AuthService, private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    // Consultar backend si hay sesión activa
    this.loginService.me().subscribe({
      next: (userData: Usuario) => {
        this.authService.setUser(userData);
        this.user = userData;
      },
      error: () => {
        this.authService.clearUser();
        this.user = null;
        this.router.navigate(['/login']);
      }
    });

    // También nos suscribimos a cambios de usuario en tiempo real
    this.authService.user$.subscribe(u => this.user = u);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  logout(): void {
    this.loginService.logout().subscribe(() => {
      this.authService.clearUser();
      this.router.navigate(['/login']); // redirige al login
    });
  }
  

  hasRole(role: string): boolean {
    return this.user?.rol === role;
  }
}