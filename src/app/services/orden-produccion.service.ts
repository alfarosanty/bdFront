import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PedidoProduccion } from '../models/pedido-produccion.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

const baseUrl = environment.apiUrl+'/PedidoProduccion';


@Injectable({
  providedIn: 'root'
})
export class OrdenProduccionService {

  constructor(private http:HttpClient) {}

  crear(ordenDePedido :PedidoProduccion): Observable<number>  {
    return this.http.post<number>(`${baseUrl}/crear`, ordenDePedido);

  }

  actualizar(ordenDePedido :PedidoProduccion)  {
   return this.http.post(`${baseUrl}/actualizar`, ordenDePedido).subscribe(
    response => {
      console.log('Respuesta de la API:', response);
    },
    error => {
      console.error('Error en la llamada POST:', error);
    }
  );
  }

  getByTaller(id:any): Observable<PedidoProduccion[]> {
    return this.http.get<PedidoProduccion[]>(`${baseUrl}/GetPedidoProduccionByTaller/${id} `);
  }

  
  get(id: any): Observable<PedidoProduccion> {
    return this.http.get<PedidoProduccion>(`${baseUrl}/GetPedidoProduccionByNumero/${id}`);
  }

}
