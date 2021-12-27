import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from './usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = `${environment.apiHost}/oauth/token`
  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (!!this._usuario)
      return this._usuario;
    else if (!!sessionStorage.getItem('usuario')) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (!!this._usuario)
      return this._token;
    else if (!!sessionStorage.getItem('token')) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const credentials: string = btoa('angularapp:12345');
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credentials
    });
    const params: URLSearchParams = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    return this.http.post<any>(this.baseUrl, params.toString(), { headers: headers });
  }

  saveUser(accessToken: string): void {
    let payload = this.getDataFromToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  saveToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  getDataFromToken(accessToken: string): any {
    if (accessToken)
      return JSON.parse(atob(accessToken.split('.')[1]));
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.getDataFromToken(this.token);
    return !!payload && !!payload.user_name && payload.user_name.length > 0;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
  }

  hasRole(role: string): boolean {
    return this.usuario.roles.includes(role);
  }
}
