// Agregamos una clase para asegurar el tipo de dato
export class Article {
  codigo: string;
  descripcion: string;
  precio: number;
  deposito: number;
  constructor(
    codigo: string,
    descripcion: string,
    precio: number,
    deposito: number
  ) {
    (this.codigo = codigo),
      (this.descripcion = descripcion),
      (this.precio = precio),
      (this.deposito = deposito);
  }
}
