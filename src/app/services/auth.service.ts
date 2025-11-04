import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private loginService = inject(LoginService);

  private userSubject = new BehaviorSubject<Usuario | null>(this.loadUserFromLocalStorage());
  user$ = this.userSubject.asObservable();

  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('rol'));
  loggedIn$ = this.loggedIn.asObservable();

  constructor() {}

  private loadUserFromLocalStorage(): Usuario | null {
    const nombre = localStorage.getItem('nombre');
    const apellido = localStorage.getItem('apellido');
    const userName = localStorage.getItem('userName');
    const rol = localStorage.getItem('rol');

    if (!rol) return null;

    return { nombre, apellido, userName, rol } as Usuario;
  }

  public loaded = new BehaviorSubject<boolean>(false);
  loaded$ = this.loaded.asObservable();



  
  checkSession() {
    this.loginService.me().subscribe({
      next: user => {
        this.setUser(user);
        this.loaded.next(true);
      },
      error: () => {
        this.loaded.next(true);
      }
    });
  }
  
  setUser(user: Usuario) {
    console.log("✅ setUser llamado con:", user);
    localStorage.setItem('nombre', user.nombre ?? '');
    localStorage.setItem('apellido', user.apellido ?? '');
    localStorage.setItem('userName', user.userName ?? '');
    localStorage.setItem('rol', user.rol ?? '');
    
    this.userSubject.next(user);
    this.loggedIn.next(true);
  }
  
  clearUser() {
    console.log("🚪 clearUser llamado");
    localStorage.clear();
    this.userSubject.next(null);
    this.loggedIn.next(false);
  }
  
  getUser(): Usuario | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }
}
