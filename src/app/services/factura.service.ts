import { Injectable } from '@angular/core';
import { Factura } from '../models/factura.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

const baseUrl = environment.prodApiUrl+'/Factura';


@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient) { }

  crear(factura :Factura)  {
   //alert('url ' + baseUrl);
   
  return this.http.post(`${baseUrl}`, factura).subscribe(
    response => {
      console.log('Respuesta de la API:', response);
    },
    error => {
      console.error('Error en la llamada POST:', error);
    }
  );
  }
}
