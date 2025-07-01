import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock.model';
import { environment } from 'src/environment/environment';

const baseUrl = environment.localApiUrl+'/Stock';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${baseUrl}/GetStock`);
  }

  get(id: any): Observable<Stock> {
    return this.http.get<Stock>(`${baseUrl}/GetById/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/PostStock`, data);
  }

  update(id: any, data: any): Observable<any> {
    //return this.http.put(`${baseUrl}/${id}`, data);
    return this.http.post(`${baseUrl}/UpdateStock`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/DeleteStock/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByProducto(producto: any): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${baseUrl}/GetByProd/${producto}`);
  }
}
