import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProdutoService } from '../../services/produto.service';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  form!: FormGroup;
  produtos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numero: [0],
      produtosIds: [[]]
    });

    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.getProdutos().subscribe(res => {
      this.produtos = res;
    });
  }

  selecionarProduto(id: number, event: any) {
    const selecionados = this.form.value.produtosIds;

    if (event.target.checked) {
      selecionados.push(id);
    } else {
      const index = selecionados.indexOf(id);
      selecionados.splice(index, 1);
    }

    this.form.patchValue({ produtosIds: selecionados });
  }

  salvar() {
    this.pedidoService.criarPedido(this.form.value).subscribe({
      next: () => {
        alert('Pedido criado!');
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
        alert(err.error); // mostra erro do backend
      }
    });
  }
}
