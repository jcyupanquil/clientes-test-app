import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseEndpoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient,
    private router: Router) { }


  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.baseEndpoint}/regiones`);
  }
  
  getClientes(pageNumber: number): Observable<any> {
    return this.http.get(`${this.baseEndpoint}/page/${pageNumber}`).pipe(
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //  let datePipe   = new DatePipe('en-US');
          // cliente.createAt = formatDate(cliente.createAt, 'dd/MM/yyyy hh:mm:ss', 'en-US');
          return cliente;
        });
        return response;
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.baseEndpoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.data as Cliente),
      catchError(e => {

        if (e.status === 400) {
          return throwError(e);
        }

        console.error(e.error.message)
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(clienteId: Number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseEndpoint}/${clienteId}`).pipe(
      catchError(e => {
        console.error(e.error.message);
        this.router.navigate(['/clientes']);
        Swal.fire('Error al editar', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.baseEndpoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {

        if (e.status === 400) {
          return throwError(e);
        }

        console.error(e.error.message)
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(clienteId: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.baseEndpoint}/${clienteId}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.message)
        Swal.fire(e.error.message, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  uploadPhoto(photo: File, clienteId: number): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("file", photo);
    formData.append("id", clienteId.toString());

    let request = new HttpRequest('POST', `${this.baseEndpoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(request);
    // .pipe(
    //   map((response: any) => response.data as Cliente),
    //   catchError(e => {
    //     console.error(e.error.message)
    //     Swal.fire(e.error.message, e.error.error, 'error');
    //     return throwError(e);
    //   })
    // );
  }
}
