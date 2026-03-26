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
  produtos: any[] = []; // 

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

  salvar() {
    this.service.createProduto(this.form.value).subscribe({
      next: () => {
        alert('Produto criado!');
        this.form.reset();
        this.listar(); // 
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar produto');
      }
    });
  }
}
