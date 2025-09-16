import { Injectable } from '@angular/core';
import { PedidoProduccion } from '../models/pedido-produccion.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingreso } from '../models/ingreso.model';
import { environment } from 'src/environment/environment';
import { PedidoProduccionIngresoDetalle } from '../models/pedido-produccion-ingreso-detalle.model';

const baseUrl = environment.apiUrl+'/Ingreso';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {


  constructor(private http:HttpClient) {}

  crear(ingresoMercaderia: Ingreso): Observable<any> {
    return this.http.post<any>(`${baseUrl}/crear`, ingresoMercaderia);
  }
  

  actualizar(ingresoMercaderia :Ingreso)  {
    //alert('url' + baseUrl);
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
    return this.http.get<PedidoProduccion[]>(`${baseUrl}/IngresoByTaller/${id} `);
  }

  
  get(id: any): Observable<PedidoProduccion> {
    return this.http.get<PedidoProduccion>(`${baseUrl}/IngresoByNumero/${id}`);
  }

  crearDetallesIngresoPedidoProduccion(detallesPedidoProduccion: PedidoProduccionIngresoDetalle[]): Observable<any> {
    return this.http.post<any>(`${baseUrl}/DetallesIngresoPedidoProduccion`, detallesPedidoProduccion);

  }

  getDetallePPI(ingreso: Ingreso): Observable<PedidoProduccionIngresoDetalle[]> {
    // Suponiendo que la API responde con el detalle de un ingreso específico
    return this.http.get<PedidoProduccionIngresoDetalle[]>(`${baseUrl}/DetallesIngresoPedidoProduccion/${ingreso.id}`);
  }

  borrarDetalles(detallesDeIngresosPP: PedidoProduccionIngresoDetalle[]): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/DetallesIngresoPedidoProduccion/borrar`, {
      body: detallesDeIngresosPP
    });
  }
  
  borrar(ingreso: Ingreso): Observable<any> {
    return this.http.delete<any>(`${baseUrl}/borrar`, {
      body: ingreso
    });
  }
  

}
