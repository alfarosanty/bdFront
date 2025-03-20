import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Presupuesto } from '../models/presupuesto.model';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:7166/Presupuesto';


@Injectable({
  providedIn: 'root'
})




export class PresupuestoService {

  constructor(private http: HttpClient) {}

  crear(presupuesto :Presupuesto)  {
    alert('url' + baseUrl);
  return this.http.post(`${baseUrl}`, presupuesto).subscribe(
    response => {
      console.log('Respuesta de la API:', response);
    },
    error => {
      console.error('Error en la llamada POST:', error);
    }
  );
  }

  actualizar(presupuesto :Presupuesto)  {
    alert('url' + '${baseUrl}');
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


 


