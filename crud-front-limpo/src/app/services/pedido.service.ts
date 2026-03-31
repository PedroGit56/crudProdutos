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

 
  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

 
  updatePedido(id: number, pedido: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, pedido);
  }

 
  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  atualizarPedido(id: number, pedido: any) {
    return this.http.put(`${this.api}/${id}`, pedido);
  }
}
