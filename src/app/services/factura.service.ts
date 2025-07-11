import { Injectable } from '@angular/core';
import { Factura } from '../models/factura.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

const baseUrl = environment.localApiUrl+'/Factura';


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
}
