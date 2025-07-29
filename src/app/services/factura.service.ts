import { Injectable } from '@angular/core';
import { Factura } from '../models/factura.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';
import { RespuestaEstadistica } from '../models/respuesta-estadistica.model';

const baseUrl = environment.apiUrl+'/Factura';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient) { }

crear(factura :Factura): Observable<Object>   {
  //alert('url' + baseUrl);
  return this.http.post(`${baseUrl}/crear`, factura)
  }

actualizar(factura :Factura): Observable<Object>   {
  //alert('url' + baseUrl);
  return this.http.post(`${baseUrl}/actualizar`, factura)
  }

  getFacturacionXCliente(filtros: { fechaInicio: string|null, fechaFin: string|null }): Observable<RespuestaEstadistica[]> {
    const params = new HttpParams()
      .set('fechaInicio', filtros.fechaInicio!)
      .set('fechaFin', filtros.fechaFin!);
  
    return this.http.get<RespuestaEstadistica[]>(`${baseUrl}/FacturacionXCliente`, { params });
  }
  

}
