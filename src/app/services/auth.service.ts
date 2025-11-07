import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$ = this.userSubject.asObservable();

  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  private loaded = new BehaviorSubject<boolean>(false);
  loaded$ = this.loaded.asObservable();

  constructor(private loginService: LoginService) {
    const user = this.loadUserFromLocalStorage();
    if (user) {
      this.userSubject.next(user);
      this.loggedIn.next(true);
    }

  }

  private loadUserFromLocalStorage(): Usuario | null {
    const rol = localStorage.getItem('rol');
    if (!rol) return null;

    return {
      nombre: localStorage.getItem('nombre') ?? '',
      apellido: localStorage.getItem('apellido') ?? '',
      userName: localStorage.getItem('userName') ?? '',
      rol
    };
  }

  
  checkSession(): void {
    console.log("🔄 checkSession() llamado");
  
    const raw = localStorage.getItem('user');
    console.log("📦 Valor en localStorage:", raw);
  
    if (!raw) {
      console.log("⛔ No había usuario en localStorage");
      this.loggedIn.next(false);
      this.userSubject.next(null);
      return;
    }
  
    try {
      const usuario = JSON.parse(raw);
      console.log("✅ Usuario recuperado:", usuario);
      this.userSubject.next(usuario);
      this.loggedIn.next(true);
    } catch (e) {
      console.log("⚠️ Error al parsear usuario desde localStorage:", e);
      this.loggedIn.next(false);
      this.userSubject.next(null);
    }
  }
  
  setUser(usuario: Usuario): void {
    console.log("🟢 setUser() =>", usuario);
    localStorage.setItem('user', JSON.stringify(usuario));
    this.userSubject.next(usuario);
    this.loggedIn.next(true);
  }
  
  clearUser(): void {
    console.log("🔴 clearUser()");
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.loggedIn.next(false);
  }
  

  hasRole(roles: string[]): boolean {
    return roles.includes(this.userSubject.value?.rol!);
  }

  getUser(): Usuario | null { return this.userSubject.value; }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

}
