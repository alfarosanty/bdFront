import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from 'src/environment/environment';

const baseUrl = environment.apiUrl+'/api/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(baseUrl);
  }

  create(usuario: Usuario): Observable<any> {
    return this.http.post(baseUrl, usuario);
  }

  update(usuario: Usuario): Observable<any> {
    return this.http.put(`${baseUrl}/${usuario.id}`, usuario);
  }

  delete(id: number) {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  
}
