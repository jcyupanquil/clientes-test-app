import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  regiones: Region[];

  private cliente: Cliente = new Cliente();
  private titulo: string = "Creación de cliente";
  private errors: string[] = null;

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();

    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let clienteId = params['id'];
      if (clienteId) {
        this.clienteService.getCliente(clienteId).subscribe(cliente => this.cliente = cliente);
      }
    })
  }

  public create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        Swal.fire('Nuevo Cliente', `${cliente.nombre} ha sido creado con éxito`, 'success');
      },
      err => this.errors = err.error.errors as string[]
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        Swal.fire('Actualización de cliente', `${response.message} : ${response.data.nombre}`, 'success');
      },
      err => this.errors = err.error.errors as string[])
  }

  compararRegion(regionSelected, regionCliente): boolean {
    if (regionSelected === undefined && regionCliente === undefined) {
      return true;
    }
    if (regionSelected === null || regionCliente === null) {
      return false;
    }
    return regionSelected.id === regionCliente.id;
  }
}
