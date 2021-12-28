import { Cliente } from "src/app/clientes/cliente.model";
import { ItemFactura } from "./item-factura.model";

export class Factura {
    id: number;
    descripcion: string;
    observacion: string;
    items: ItemFactura[] = [];
    cliente: Cliente;
    total: number;
    createAt: Date;

    calcularTotal(): number {
        this.total = this.items.reduce((prev: number, curr: ItemFactura) =>
            prev + curr.calcularImporte(), 0)
        return this.total;
    }
}
