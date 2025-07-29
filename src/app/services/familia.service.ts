import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Familia } from '../models/familia.model';
import { environment } from 'src/environment/environment';

const baseUrl = environment.apiUrl+'/SubFamilia';

@Injectable({
  providedIn: 'root'
})
export class FamiliaService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Familia[]> {
    return this.http.get<Familia[]>(`${baseUrl}/GetSubFamilias `);
  }

}
