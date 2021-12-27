import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  title: string = 'Detalle del cliente';
  private selectedFile: File;
  progress: number = 0;

  constructor(private clienteService: ClienteService,
    private modalService: ModalService,
    private authService: AuthService) { }

  ngOnInit() {
    // this.activatedRoute.paramMap.subscribe(params => {
    //   let id: number = +params.get('id');
    //   if (id) {
    //     this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
    //   }
    // });
  }


  selectFile(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
    if (this.selectedFile && this.selectedFile.type.indexOf('image') < 0) {
      Swal.fire('Formato inválido', 'El archivo debe ser una imagen', 'error');
      event.target.value = '';
      this.selectedFile = null;
    }
  }


  uploadFile() {
    if (!this.selectedFile) {
      Swal.fire('Error', 'Debe seleccionar una foto', 'error')
    } else {
      this.clienteService.uploadPhoto(this.selectedFile, this.cliente.id).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((event.loaded / event.total) * 100)
        } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.cliente = response.data as Cliente;
          this.modalService.notifyUpload.emit(this.cliente);
          Swal.fire('La foto se ha actualizado correctamente', response.message, 'success');
          this.progress = 0;
        }
      });
    }
  }


  hideModal(): void {
    this.modalService.hideModal();
    this.selectedFile = null;
    this.progress = 0;
  }

}
