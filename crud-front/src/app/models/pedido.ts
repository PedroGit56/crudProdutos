import { Produto } from './produto';

export interface Pedido {
  id?: number;
  numero: number;
  produtos: Produto[];
}
