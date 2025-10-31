import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: Usuario) { this.userSubject.next(user); }
  clearUser() { this.userSubject.next(null); }
  getUser() { return this.userSubject.value; }
  isLoggedIn() { return !!this.userSubject.value; }

}
