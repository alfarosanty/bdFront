import { Injectable } from '@angular/core';
import { Articulo } from '../models/articulo.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { ArticuloPrecio } from '../models/articulo-precio.model';
import { PresupuestoArticulo } from '../models/presupuesto-articulo.model';

const baseUrl = environment.apiUrl+'/Articulo';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${baseUrl}/GetArticulos`);
  }

  getByFamiliaMedida(familia:any, medida:any):  Observable<Articulo[]>{
    return this.http.get<Articulo[]>(`${baseUrl}/ByFamiliaMedida/` +familia +'/'+medida );

  }

  getByArticuloPrecio(id: any, habilitados: boolean): Observable<Articulo[]> {
    const params = new HttpParams().set('habilitados', habilitados.toString());
    return this.http.get<Articulo[]>(`${baseUrl}/ByArticuloPrecio/${id}`, { params });
  }
  


  getAllArticuloPrecio(): Observable<ArticuloPrecio[]> {
    return this.http.get<ArticuloPrecio[]>(`${baseUrl}/GetArticulosPrecio`);
  }

  crearArticulos(articulos: Articulo[]): Observable<any> {
    return this.http.post(`${baseUrl}/CrearArticulos`, articulos);
  }

  consultarMedidasNecesarias(articulos: PresupuestoArticulo[]): Observable<any> {
    return this.http.post(`${baseUrl}/ConsultarMedidasNecesarias`, articulos);
  }

  crearArticulosPrecios(articulosPrecio: ArticuloPrecio[]): Observable<any>{
    return this.http.post(`${baseUrl}/CrearArticulosPrecios`, articulosPrecio);
  }

  actualizarArticulosPrecios(articulosPrecio: ArticuloPrecio[]): Observable<any>{
    return this.http.post(`${baseUrl}/ActualizarArticulosPrecios`, articulosPrecio);
  }

  getCantidadesTallerCortePorArticuloPrecio(id: number): Observable<any> {
    return this.http.get<any>(`${baseUrl}/${id}/cantidades-taller-corte`);
  }

  getCantidadesTallerCorte(): Observable<any> {
    return this.http.get<any>(`${baseUrl}/cantidades-taller-corte`);
  }
 
actualizarStock(listaStock:{IdArticulo: number, CantidadStock: number}[]): Observable<any>{
  return this.http.post<any>(`${baseUrl}/ActualizarStock`, listaStock);

}
  
}
