import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProdutoService } from '../../services/produto.service';
import { PedidoService } from '../../services/pedido.service';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    RouterModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  form!: FormGroup;
  produtos: any[] = [];
  pedidos: any[] = [];
  
  pedidosFiltrados: any[] = [];

  filtroNumero = new FormControl('');

  produtosSelecionados: number[] = [];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private pedidoService: PedidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numero: [0],
      produtosIds: [[]]
    });

    this.carregarProdutos();
    this.carregarPedidos();

    this.filtroNumero.valueChanges.subscribe(valor => {
      this.filtrarPedidos(valor ?? '');
    });
  }

  carregarPedidos(): void {
    this.pedidoService.getPedidos().subscribe({
      next: (res) => {
        this.pedidos = res;
        this.pedidosFiltrados = res;
      },
      error: (err) => this.mostrarErro('Erro ao carregar pedidos', err)
    });
  }

  carregarProdutos(): void {
    this.produtoService.getProdutos().subscribe({
      next: (res) => this.produtos = res,
      error: (err) => this.mostrarErro('Erro ao carregar produtos', err)
    });
  }

  filtrarPedidos(valor: string): void {
    const numero = Number(valor);

    if (!numero) {
      this.pedidosFiltrados = this.pedidos;
      return;
    }

    this.pedidosFiltrados = this.pedidos.filter(p => p.numero === numero);
  }

  selecionarProduto(id: number, event: any): void {
    if (event.checked) {
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

  deletarPedido(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar este pedido?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.pedidoService.deletePedido(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Pedido deletado com sucesso!'
            });

            this.carregarPedidos();
          },
          error: (err) => this.mostrarErro('Erro ao deletar pedido', err)
        });
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.pedidoService.criarPedido(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Pedido criado com sucesso!'
        });

        this.form.reset({ numero: 0, produtosIds: [] });
        this.produtosSelecionados = [];

        this.carregarPedidos();
      },
      error: (err) => this.mostrarErro('Erro ao criar pedido', err)
    });
  }

  private mostrarErro(resumo: string, erro: any): void {
    console.error(erro);

    this.messageService.add({
      severity: 'error',
      summary: resumo,
      detail: erro?.error || 'Ocorreu um erro inesperado.'
    });
  }
}
