import { Factura } from "../facturas/models/factura.model";
import { Region } from "./region";

export class Cliente {
    id: number;
    nombre: string;
    apellido: string;
    createAt: string;
    email: string;
    foto: string;
    region: Region;
    facturas: Factura[] = [];
}