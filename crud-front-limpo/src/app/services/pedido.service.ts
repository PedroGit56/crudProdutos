import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private api = 'http://localhost:5065/api/pedido';

  constructor(private http: HttpClient) {}

  criarPedido(pedido: any): Observable<any> {
    return this.http.post(this.api, pedido);
  }

  deletePedido(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }
}
