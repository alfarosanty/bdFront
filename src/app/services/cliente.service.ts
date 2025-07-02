import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

const baseUrl = environment.prodApiUrl+'/Cliente';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) {}

  actualizar(cliente :Cliente)  {
    //alert('url' + '${baseUrl}');
   return this.http.post(`${baseUrl}`, cliente).subscribe(
    response => {
      console.log('Respuesta de la API:', response);
    },
    error => {
      console.error('Error en la llamada POST:', error);
    }
  );
  }

  guardar(cliente :Cliente)  {
    //alert('url' + '${baseUrl}');
   return this.http.post(`${baseUrl}`, cliente).subscribe(
    response => {
      console.log('Respuesta de la API:', response);
    },
    error => {
      console.error('Error en la llamada POST:', error);
    }
  );
  }

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${baseUrl}/GetClientes `);
  }

  get(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${baseUrl}/GetClienteById/${id}`);
  }

}

