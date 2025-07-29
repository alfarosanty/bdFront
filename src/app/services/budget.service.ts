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

  crear(presupuesto :Presupuesto): Observable<Object>   {
  //alert('url' + baseUrl);
  return this.http.post(`${baseUrl}/crear`, presupuesto)
  }

  actualizar(presupuesto :Presupuesto): Observable<Object>   {
    //alert('url' + baseUrl);
    console.log('pedidoProducción actualizado')
   return this.http.post(`${baseUrl}/actualizar`, presupuesto);
  }

  getByCliente(id:any): Observable<Presupuesto[]> {
    return this.http.get<Presupuesto[]>(`${baseUrl}/GetPresupuestoByCliente/${id} `);
  }

  

  get(id: any): Observable<Presupuesto> {
    return this.http.get<Presupuesto>(`${baseUrl}/GetPresupuestoByNumero/${id}`);
  }
}


 


