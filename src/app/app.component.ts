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

  user: Usuario | null = null;

  constructor(public authService: AuthService,
              private loginService: LoginService,
              private router: Router) {}

              ngOnInit(): void {

                this.authService.checkSession();
                
                this.authService.user$.subscribe(u => {
                  console.log("👤 user$ cambió:", u);
                  this.user = u;
                });

              
                this.authService.loggedIn$.subscribe(v => {
                  console.log("🔐 loggedIn$ cambió:", v);
                });
              
                this.loginService.me().subscribe({
                  next: (userData: Usuario) => {
                    console.log("✅ /me devolvió usuario:", userData);
                    this.authService.setUser(userData);
                  },
                  error: (err) => {
                    console.log("❌ /me falló:", err.status, err.error);
              
                    if (!this.authService.isLoggedIn()) {
                      console.log("➡️ Redirigiendo al login porque NO hay usuario en memoria.");
                      this.router.navigate(['/login']);
                    } else {
                      console.log("⚠️ /me falló pero mantengo el usuario, porque ya estaba logueado.");
                    }
                  }
                });
              }
              

  logout(): void {
    this.loginService.logout().subscribe(() => {
      this.authService.clearUser();
      this.router.navigate(['/login']);
    });
  }

  hasRole(role: string): boolean {
    return this.user?.rol === role;
  }
}
