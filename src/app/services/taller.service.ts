import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Taller } from '../models/taller.model';
import { environment } from 'src/environment/environment';

const baseUrl = environment.prodApiUrl+'/Taller';

@Injectable({
  providedIn: 'root'
})
export class TallerService {

  constructor(private http: HttpClient) { }

  getAll():Observable<Taller[]>{
    return this.http.get<Taller[]>(`${baseUrl}/GetTalleres `);

  }
}
