import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProdutoService } from '../../services/produto.service';
import { PedidoService } from '../../services/pedido.service';
import { FormControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CheckboxModule, ToastModule, ConfirmDialogModule],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  form!: FormGroup;
  produtos: any[] = [];
  pedidos: any[] = [];
  filtroNumero = new FormControl('');
  pedidosFiltrados: any[] = [];


  produtosSelecionados: number[] = [];

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
    this.carregarPedidos();

    this.filtroNumero.valueChanges.subscribe(valor => {
      this.filtrarPedidos(valor || '');
    })
  }

  carregarPedidos() {
    this.pedidoService.getPedidos().subscribe(res => {
      this.pedidos = res;
    });
  }

  filtrarPedidos(valor: string) {
    const numero = Number(valor);

    if (!numero || numero === 0) {
      this.pedidosFiltrados = this.pedidos;
    } else {
      this.pedidosFiltrados = this.pedidos.filter(p => p.numero === numero);
    }
  }

  deletarPedido(id: number) {
    this.pedidoService.deletePedido(id).subscribe(() => {
      alert('Pedido deletado');
      this.carregarPedidos;
    })
  }

  carregarProdutos() {
    this.produtoService.getProdutos().subscribe(res => {
      this.produtos = res;
    });
  }

  
  selecionarProduto(id: number, event: any) {
    if (event.target.checked) {

      if (!this.produtosSelecionados.includes(id)) {
        this.produtosSelecionados.push(id);
      }

    } else {
      this.produtosSelecionados = this.produtosSelecionados.filter(p => p !== id);
    }

    this.form.patchValue({
      produtosIds: this.produtosSelecionados
    });
  }

  salvar() {
    this.pedidoService.criarPedido(this.form.value).subscribe({
      next: () => {
        alert('Pedido criado!');

        this.form.reset();
        this.produtosSelecionados = []; 
        this.carregarPedidos(); 
      },
      error: (err: any) => {
        console.error(err);
        alert(err.error);
      }
    });
  }
}
