import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  loaded = false;

  constructor(
    public authService: AuthService,
    private loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("🚀 AppComponent iniciado, llamando checkSession()");
    this.authService.checkSession();
  
    this.authService.user$.subscribe(u => {
      console.log("👤 user$ cambió:", u);
      this.user = u;
      this.cdr.detectChanges();
    });

    this.authService.loggedIn$.subscribe(v => {
      console.log("🔐 loggedIn$ cambió:", v);
      if (!v) {
        this.router.navigate(['/']);
      }
    });
  
    this.authService.loggedIn$.subscribe(v => {
      console.log("🔐 loggedIn$ cambió:", v);
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

