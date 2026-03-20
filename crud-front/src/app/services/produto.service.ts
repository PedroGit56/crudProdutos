import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from '../models/produto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private api = 'http://localhost:5065/api/produto';

  constructor(private http: HttpClient) { }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.api);
  }

  createProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.api, produto);
  }
}
