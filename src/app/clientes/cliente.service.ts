import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cliente } from './cliente';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseEndpoint: string = 'http://localhost:8080/api/clientes';
  // private httpHeaders: HttpHeaders = new HttpHeaders({
  //   'Content-Type': 'application/json'
  // });

  constructor(private http: HttpClient,
    private router: Router
    // private authService: AuthService
  ) { }

  // addAuthorizationHeader(): HttpHeaders {
  //   let token = this.authService.token;
  //   if (!!token)
  //     return this.httpHeaders.append('Authorization', 'Bearer ' + token);
  //   return this.httpHeaders;
  // }

  // private isNotAuthorized(e): boolean {
  //   if (e.status === 401) {
  //     if (this.authService.isAuthenticated())
  //       this.authService.logout();
  //     this.router.navigate(['/login']);
  //     return true;
  //   }
  //   if (e.status === 403) {
  //     Swal.fire('Acceso denegado', 'No tienes asignado acceso a este recurso', 'warning');
  //     this.router.navigate(['/clientes']);
  //     return true;
  //   }
  //   return false;
  // }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.baseEndpoint}/regiones`/*, { headers: this.addAuthorizationHeader() }*/);
    // .pipe(
    //   catchError(e => {
    //     this.isNotAuthorized(e);
    //     return throwError(e);
    //   })
    // );
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
    return this.http.post(this.baseEndpoint, cliente/*, { headers: this.addAuthorizationHeader() }*/).pipe(
      map((response: any) => response.data as Cliente),
      // catchError(e => {

      //   if (this.isNotAuthorized(e))
      //     return throwError(e);

      //   if (e.status === 400) {
      //     return throwError(e);
      //   }

      //   console.error(e.error.message)
      //   Swal.fire(e.error.message, e.error.error, 'error');
      //   return throwError(e);
      // })
    );
  }

  getCliente(clienteId: Number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseEndpoint}/${clienteId}`/*, { headers: this.addAuthorizationHeader() }*/)
      .pipe(
        catchError(e => {
          if (e.status != 401 && e.error.mensaje) {
            this.router.navigate(['/clientes']);
          }
          return throwError(e);
          //     if (this.isNotAuthorized(e))
          //       return throwError(e);

          //     console.error(e.error.message);
          //     this.router.navigate(['/clientes']);
          //     Swal.fire('Error al editar', e.error.message, 'error');
          //     return throwError(e);
        })
      );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.baseEndpoint}/${cliente.id}`, cliente/*, { headers: this.addAuthorizationHeader() }*/);
    // .pipe(
    //   catchError(e => {

    //     if (this.isNotAuthorized(e))
    //       return throwError(e);

    //     if (e.status === 400) {
    //       return throwError(e);
    //     }

    //     console.error(e.error.message)
    //     Swal.fire(e.error.message, e.error.error, 'error');
    //     return throwError(e);
    //   })
    // );
  }

  delete(clienteId: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.baseEndpoint}/${clienteId}`/*, { headers: this.addAuthorizationHeader() }*/)
    // .pipe(
    //   catchError(e => {

    //     if (this.isNotAuthorized(e))
    //       return throwError(e);

    //     console.error(e.error.message)
    //     Swal.fire(e.error.message, e.error.error, 'error');
    //     return throwError(e);
    //   })
    // );
  }

  uploadPhoto(photo: File, clienteId: number): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("file", photo);
    formData.append("id", clienteId.toString());

    // let httpHeaders: HttpHeaders = new HttpHeaders();
    // let token = this.authService.token;
    // if (!!token)
    //   httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);

    let request = new HttpRequest('POST', `${this.baseEndpoint}/upload`, formData, {
      reportProgress: true
      // headers: httpHeaders
    });

    return this.http.request(request);
    // .pipe(
    //   catchError(e => {
    //     this.isNotAuthorized(e);
    //     return throwError(e);
    //   })
    // );
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
