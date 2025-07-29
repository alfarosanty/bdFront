import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Color } from '../models/color.model';

const baseUrl = environment.apiUrl+'/Color';


@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(private http: HttpClient) { }


  getAll(): Observable<Color[]> {
    return this.http.get<Color[]>(`${baseUrl}/GetColores `);
  }

}
