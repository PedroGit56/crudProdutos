import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';


import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table'; 
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-produto',
  standalone: true,

  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    Button, 
    InputText, 
    InputNumber, 
    TableModule, 
    Toast, 
    ConfirmDialog,
    RouterModule
  ],
 
  providers: [MessageService, ConfirmationService],
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {

  form!: FormGroup;
  produtos: any[] = [];
  produtoEditandoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: ProdutoService,
    private messageService: MessageService,      
    private confirmationService: ConfirmationService 
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [''],
      preco: [0]
    });

    this.listar(); 
  }

  listar() {
    this.service.getProdutos().subscribe({
      next: (res) => {

        this.produtos = res; 
      },
      error: (err) => console.error(err)
    });
  }

  editar(produto: any) {
    this.form.patchValue(produto);
    this.produtoEditandoId = produto.id;
  }

  deletar(id: number) {
    
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar este produto?',
      header: 'Confirmação de Exclusão',
      icon: 'pi pi-excluir',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.service.deleteProduto(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto deletado!' });
            this.listar(); 
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error });
          }
        });
      }
    });
  }

  salvar() {
    const acao = this.produtoEditandoId 
      ? this.service.updateProduto(this.produtoEditandoId, this.form.value)
      : this.service.createProduto(this.form.value);

    acao.subscribe({
      next: () => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Sucesso', 
          detail: this.produtoEditandoId ? 'Produto atualizado!' : 'Produto criado!' 
        });
        this.form.reset();
        this.produtoEditandoId = null;
        this.listar();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha na operação' });
      }
    });
  }
}
