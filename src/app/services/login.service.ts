import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { UsuarioLoginRequest } from '../models/usuario-login-request.model';
import { catchError, Observable, tap, throwError } from 'rxjs';

const baseUrl = environment.apiUrl+'/api/auth';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  


  constructor(private http: HttpClient) { }

  login(credentials: { userName: string; contrasenia: string }) {
    console.log("👉 Enviando login con:", credentials);
  
    return this.http.post<any>(`${baseUrl}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(res => console.log("✅ Respuesta del backend:", res)),
        catchError(err => {
          console.error("❌ Error recibido del backend:", err);
          return throwError(() => err);
        })
      );
  }
  

  logout(): Observable<any> {
    return this.http.post(`${baseUrl}/logout`, {}, { withCredentials: true });
  }

  me(): Observable<any> {
    return this.http.get(`${baseUrl}/me`, { withCredentials: true });
  }
}
