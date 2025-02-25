import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:7166/Cliente';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${baseUrl}/GetClientes `);
  }

  get(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${baseUrl}/GetClienteById/${id}`);
  }

}

