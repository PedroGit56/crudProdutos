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
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

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
    RouterModule,
    DialogModule,
    FormsModule
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

  pedidoEditandoId: number | null = null;

  mostrarModal = false;

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private pedidoService: PedidoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      numero: [''],
      produtosIds: [[]]
    });

    this.carregarProdutos();
    this.carregarPedidos();

    this.filtroNumero.valueChanges.subscribe(valor => {
      this.filtrarPedidos(valor ?? '');
    });
  }

editarPedido(pedido: any) {
  this.pedidoEditandoId = pedido.id;

  this.form.patchValue({
    numero: pedido.numero 
  });

  this.produtosSelecionados = pedido.produtos.map((p: any) => p.id);

  this.mostrarModal = true;
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
  }

 removerProduto(id: number) {
  this.produtosSelecionados = this.produtosSelecionados.filter(p => p !== id);

  this.form.patchValue({
    produtosIds: this.produtosSelecionados
  });
}


  deletarPedido(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar este pedido?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',

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
  const payload = {
    numero: Number(this.form.getRawValue().numero),
    produtosIds: this.produtosSelecionados
  };

  console.log('ENVIANDO:', payload); 

  if (this.pedidoEditandoId !== null) {
    this.pedidoService.atualizarPedido(this.pedidoEditandoId, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Pedido atualizado com sucesso!'
        });

        this.resetForm();
      },
      error: (err) => {
        console.error('ERRO BACK:', err);
        this.mostrarErro('Erro ao atualizar pedido', err);
      }
    });
  }
}

  resetForm() {
    this.form.reset({ numero: '', produtosIds: [] });
    this.produtosSelecionados = [];
    this.pedidoEditandoId = null;
    this.mostrarModal = false;
    this.carregarPedidos();
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
