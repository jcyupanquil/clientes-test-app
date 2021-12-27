import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor sign in!';
  usuario: Usuario;

  constructor(private authService: AuthService,
    private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated())
      this.router.navigate(['/clientes']);
  }

  login(): void {
    if (!this.usuario.username || !this.usuario.password) {
      Swal.fire('Error Login', 'Username or password incorrect', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {

      this.authService.saveUser(response.access_token);
      this.authService.saveToken(response.access_token);

      let usuario = this.authService.usuario;

      this.router.navigate(['/clientes']);
      Swal.fire('Logged in Successfully!', `Welcome back, ${usuario.nombre}`, 'success');
    }, err => {
      if (err.status === 400)
        Swal.fire('Invalid Credentials', 'User or password incorrect', 'error');
      else
        Swal.fire('Woops...', 'The system is currently under maintenance. Please try again shortly.', 'error');
    });
  }

}
