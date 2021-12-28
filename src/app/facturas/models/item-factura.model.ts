import { Producto } from "./producto.model";

export class ItemFactura {
    producto: Producto;
    cantidad: number = 1;
    importe: number;

    public calcularImporte(): number {
        return this.cantidad * this.producto.precio;
    }
}
