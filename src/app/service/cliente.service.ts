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
    return this.http.get<Cliente[]>(`${baseUrl}/`);
  }

  get(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${baseUrl}/GetById/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/PostStock`, data);
  }

  update(id: any, data: any): Observable<any> {
    //return this.http.put(`${baseUrl}/${id}`, data);
    return this.http.post(`${baseUrl}/UpdateStock`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/DeleteStock/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }
}
