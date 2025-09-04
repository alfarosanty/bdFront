import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

const baseUrl = environment.apiUrl+'/Cliente';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) {}

  actualizar(cliente: Cliente): Observable<any> {
    return this.http.post(`${baseUrl}/Actualizar/`, cliente);
  }
  
  crear(cliente: Cliente): Observable<any> {
    return this.http.post(`${baseUrl}/Crear`, cliente);
  }
  

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${baseUrl}/GetClientes `);
  }

  get(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${baseUrl}/GetClienteById/${id}`);
  }


  getCondicionFiscal(): Observable<any>{
    return this.http.get<any>(`${baseUrl}/GetCondicionFiscal`)
  }

}

