import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Medida } from '../models/medida.model';

const baseUrl = environment.localApiUrl+'/Medida';


@Injectable({
  providedIn: 'root'
})
export class MedidaService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Medida[]> {
    return this.http.get<Medida[]>(`${baseUrl}/GetMedidas `);
  }
}
