import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {

  form!: FormGroup;
  produtos: any[] = [];
  produtoEditandoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: ProdutoService
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
        console.log('PRODUTOS:', res);
        this.produtos = res; 
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  
  editar(produto: any) {
    this.form.patchValue({
      nome: produto.nome,
      preco: produto.preco
    });
    this.produtoEditandoId = produto.id;
  }

  
  deletar(id: number) {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      this.service.deleteProduto(id).subscribe(() => {
        alert('Produto deletado!');
        this.listar(); 
      });
    }
  }

  
  salvar() {
    if (this.produtoEditandoId !== null) {
      
      this.service.updateProduto(this.produtoEditandoId, this.form.value)
        .subscribe(() => {
          alert('Produto atualizado!');
          this.form.reset();
          this.produtoEditandoId = null;
          this.listar();
        });
    } else {
      
      this.service.createProduto(this.form.value)
        .subscribe(() => {
          alert('Produto criado!');
          this.form.reset();
          this.listar();
        });
    }
  }

}
