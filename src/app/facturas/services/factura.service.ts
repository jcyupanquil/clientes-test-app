import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura.model';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private baseEndpoint: string = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) { }

  getFactura(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.baseEndpoint}/${id}`);
  }

  deleteFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseEndpoint}/${id}`);
  }

  filterProductos(filter: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseEndpoint}/filtrar-productos/${filter}`);
  }

  createFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.baseEndpoint, factura);
  }
}
