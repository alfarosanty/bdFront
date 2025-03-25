import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Taller } from '../models/taller.model';

const baseUrl = 'http://localhost:7166/Taller';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  constructor(private http: HttpClient) { }

  getAll():Observable<Taller[]>{
    return this.http.get<Taller[]>(`${baseUrl}/GetTalleres `);

  }
}
