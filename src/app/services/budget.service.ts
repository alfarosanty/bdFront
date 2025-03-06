import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Presupuesto } from '../models/presupuesto.model';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:7166';


@Injectable({
  providedIn: 'root'
})




export class PresupuestoService {

  constructor(private http: HttpClient) {}

  guardar(presupuesto :Presupuesto)  {
    alert('url' + '${baseUrl}/Presupuesto');
  return this.http.post(`${baseUrl}/Presupuesto`, presupuesto).subscribe(
    response => {
      console.log('Respuesta de la API:', response);
    },
    error => {
      console.error('Error en la llamada POST:', error);
    }
  );
  }

  getByCliente(id:any): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${baseUrl}/GetPresupuestoByCliente/${id} `);
  }

  

  get(id: any): Observable<Presupuesto> {
    return this.http.get<Presupuesto>(`${baseUrl}/GetPresupuestoByNumero/${id}`);
  }
}


 


