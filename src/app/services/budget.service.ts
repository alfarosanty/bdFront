import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Presupuesto } from '../models/presupuesto.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

const baseUrl = environment.apiUrl+'/Presupuesto';


@Injectable({
  providedIn: 'root'
})




export class PresupuestoService {

  constructor(private http: HttpClient) {}

  crear(presupuesto :Presupuesto)  {
    alert('url' + baseUrl);
  return this.http.post(`${baseUrl}/crear`, presupuesto).subscribe(
    response => {
      console.log('Respuesta de la API:', response);
    },
    error => {
      console.error('Error en la llamada POST:', error);
    }
  );
  }

  actualizar(presupuesto :Presupuesto)  {
    alert('url' + baseUrl);
   return this.http.post(`${baseUrl}/actualizar`, presupuesto).subscribe(
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


 


