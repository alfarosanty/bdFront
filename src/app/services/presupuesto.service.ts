import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Articulo } from '../models/articulo.model';

@Injectable({
  providedIn: 'root'
})



export class PresupuestoService {

  constructor(private http: HttpClient) {}
}


 


