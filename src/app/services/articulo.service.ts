import { Injectable } from '@angular/core';
import { Articulo } from '../models/articulo.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { ArticuloPrecio } from '../models/articulo-precio.model';

const baseUrl = environment.prodApiUrl+'/Articulo';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${baseUrl}/GetStock`);
  }

  getByFamiliaMedida(familia:any, medida:any):  Observable<Articulo[]>{
    return this.http.get<Articulo[]>(`${baseUrl}/ByFamiliaMedida/` +familia +'/'+medida );

  }

  getByArticuloPrecio(id:any):  Observable<Articulo[]>{
    return this.http.get<Articulo[]>(`${baseUrl}/ByArticuloPrecio/` + id);

  }


  getAllArticuloPrecio(): Observable<ArticuloPrecio[]> {
    return this.http.get<ArticuloPrecio[]>(`${baseUrl}/GetArticulosPrecio`);
  }

  crearArticulos(articulos: Articulo[]): Observable<any> {
    return this.http.post(`${baseUrl}/CrearArticulos`, articulos);
  }
  
}
