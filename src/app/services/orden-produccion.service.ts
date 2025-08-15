import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PedidoProduccion } from '../models/pedido-produccion.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { EstadoPedidoProduccion } from '../models/estado-presupuesto.model';
import { Cliente } from '../models/cliente';

const baseUrl = environment.apiUrl+'/PedidoProduccion';


@Injectable({
  providedIn: 'root'
})
export class OrdenProduccionService {

  constructor(private http:HttpClient) {}

  crear(ordenDePedido :PedidoProduccion): Observable<number>  {
    return this.http.post<number>(`${baseUrl}/crear`, ordenDePedido);

  }

  actualizar(ordenDePedido: PedidoProduccion): Observable<number> {
    return this.http.post<number>(`${baseUrl}/actualizar`, ordenDePedido);
  }
  

  getByTaller(id:any): Observable<PedidoProduccion[]> {
    return this.http.get<PedidoProduccion[]>(`${baseUrl}/GetPedidoProduccionByTaller/${id} `);
  }

  
  get(id: any): Observable<PedidoProduccion> {
    return this.http.get<PedidoProduccion>(`${baseUrl}/GetPedidoProduccionByNumero/${id}`);
  }

  getEstadosPedidoProduccion(): Observable<EstadoPedidoProduccion[]> {
    return this.http.get<EstadoPedidoProduccion[]>(`${baseUrl}/GetEstadosPedidoProduccion`);
  }

  actualizarEstadosPedidoProduccion(listaPedidosAModificar: {idPedidoProduccion: number, idEstadoPedidoProduccion: number}[]): Observable<number[]> {
    return this.http.patch<number[]>(`${baseUrl}/ActualizarEstadosPedidoProduccion`, listaPedidosAModificar);
  }

  obtenerClientes(pedidosProduccion: PedidoProduccion[]): Observable<{ idPedidoProduccion: number, cliente: Cliente }[]> {
    const ids = pedidosProduccion.map(p => p.id).filter((id): id is number => id !== undefined);
    return this.http.post<{ idPedidoProduccion: number, cliente: Cliente }[]>(`${baseUrl}/ObtenerClientes`, ids);
  }
  
  eliminarPedidosProduccion(listaIdsPedidosAEliminar: number[]): Observable<number[]> {
    return this.http.post<number[]>(`${baseUrl}/EliminarPedidosProduccion`, listaIdsPedidosAEliminar);
  }

  
  
  

}
