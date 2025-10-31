import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { UsuarioLoginRequest } from '../models/usuario-login-request.model';
import { Observable } from 'rxjs';

const baseUrl = environment.apiUrl+'/api/auth';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  


  constructor(private http: HttpClient) { }

  login(credentials: UsuarioLoginRequest): Observable<any> {
    return this.http.post(`${baseUrl}/login`, credentials, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${baseUrl}/logout`, {}, { withCredentials: true });
  }

  me(): Observable<any> {
    return this.http.get(`${baseUrl}/me`, { withCredentials: true });
  }
}
