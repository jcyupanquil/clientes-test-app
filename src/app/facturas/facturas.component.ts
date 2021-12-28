import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura.model';
import { ItemFactura } from './models/item-factura.model';
import { Producto } from './models/producto.model';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  title: string = 'Nueva Factura';
  factura: Factura;

  autocompleteControl = new FormControl();
  // productos: string[] = ['One', 'Two', 'Three'];
  productos: Producto[] = [];
  filteredProducts: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
    private facturaService: FacturaService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.factura = new Factura();
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId)
        .subscribe(cliente => this.factura.cliente = cliente);
    });

    this.filteredProducts = this.autocompleteControl.valueChanges.pipe(
      // startWith(''),
      map(value => typeof value === 'string' ? value : value.nombre),
      flatMap(value => !!value ? this.facturaService.filterProductos(value) : []),
    );
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.productos.filter(option => option.toLowerCase().includes(filterValue));
  // }

  showProducto(producto?: Producto): string | undefined {
    return producto ? producto.nombre : undefined;
  }

  selectProducto(event: MatAutocompleteSelectedEvent): void {
    let producto: Producto = event.option.value as Producto;
    let existingProduct = this.factura.items.find(item => item.producto.id === producto.id);

    if (existingProduct) {
      existingProduct.cantidad += 1;
      return;
    }

    let nuevoItem: ItemFactura = new ItemFactura();
    nuevoItem.producto = producto;
    this.factura.items.push(nuevoItem);

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  updateItem(selectedItem: ItemFactura, value: any): void {
    let cantidad: number = (+value);
    if (cantidad === 0) {
      this.removeItem(selectedItem);
      return;
    }
    this.factura.items.find(item => item === selectedItem).cantidad = cantidad;
  }

  removeItem(selectedItem: ItemFactura): void {
    this.factura.items.splice(this.factura.items.findIndex(item => item === selectedItem), 1);
  }

  createFactura(facturaForm: any): void {
    if (this.factura.items.length === 0) {
      this.autocompleteControl.setErrors({'invalid': true});
    }
    
    if (facturaForm.form.invalid || this.factura.items.length === 0) {
      return;
    }

    this.facturaService.createFactura(this.factura).subscribe(factura => {
      Swal.fire(this.title, 'Factura created successfully!', 'success');
      this.router.navigate(['/clientes']);
    })
  }
}
