import { Injectable } from '@angular/core';
import { Articulo } from '../models/articulo.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

const baseUrl = environment.apiUrl+'/Articulo';

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


  getAllFamiliaMedida(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(`${baseUrl}/GetArticulosByFamiliaMedida`);
  }

  
}
