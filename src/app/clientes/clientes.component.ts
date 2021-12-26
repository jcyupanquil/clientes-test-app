import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {


  clientes: Cliente[];
  paginator: any;
  selectedClient: Cliente;

  constructor(private clienteService: ClienteService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {

      let pageNumber: number = +params.get('pageNumber');
      if (!pageNumber) {
        pageNumber = 0;
      }

      this.clienteService.getClientes(pageNumber).pipe(
        tap((response: any) => {
          this.clientes = response.content;
          this.paginator = response;
        })
      ).subscribe()
    });

    this.modalService.notifyUpload.subscribe(updatedCliente => {
      this.clientes.map(cliente => {
        if (cliente.id === updatedCliente.id) {
          cliente.foto = updatedCliente.foto;
        }
      })
    });
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: '¿Está seguro de realizar esta acción?',
      text: `Seguro que desea eliminar al cliente ${cliente.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(response => {
          this.clientes = this.clientes.filter(element => element.id !== cliente.id)
          Swal.fire(
            '¡Cliente Eliminado!',
            `Cliente ${cliente.nombre} eliminado con éxito`,
            'success'
          )
        });
      }
    })

  }

  showClientDetail(cliente: Cliente): void {
    this.modalService.showModal();
    this.selectedClient = cliente;
  }
}
