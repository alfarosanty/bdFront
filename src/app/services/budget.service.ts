import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Articulo } from '../models/articulo.model';
import { Presupuesto } from '../models/presupuesto.model';

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

}


 


