import { Injectable } from '@angular/core';
import { PedidoProduccion } from '../models/pedido-produccion.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IngresoMercaderia } from '../models/ingreso-mercaderia.model';

const baseUrl = 'http://localhost:7166/Ingreso';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {


  constructor(private http:HttpClient) {}

  crear(ingresoMercaderia : IngresoMercaderia)  {
    alert('url' + baseUrl);
  return this.http.post(`${baseUrl}/crear`, ingresoMercaderia).subscribe(
    response => {
      console.log('Respuesta de la API:', response);
    },
    error => {
      console.error('Error en la llamada POST:', error);
    }
  );
  }

  actualizar(ingresoMercaderia :IngresoMercaderia)  {
    alert('url' + baseUrl);
   return this.http.post(`${baseUrl}/actualizar`, ingresoMercaderia).subscribe(
    response => {
      console.log('Respuesta de la API:', response);
    },
    error => {
      console.error('Error en la llamada POST:', error);
    }
  );
  }

  getByTaller(id:any): Observable<PedidoProduccion[]> {
    return this.http.get<PedidoProduccion[]>(`${baseUrl}/GetIngresoByTaller/${id} `);
  }

  
  get(id: any): Observable<PedidoProduccion> {
    return this.http.get<PedidoProduccion>(`${baseUrl}/GetIngresoByNumero/${id}`);
  }
}
