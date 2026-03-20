import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css'
})
export class ProdutoComponent {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ProdutoService
  ) {
    this.form = this.fb.group({
      nome: [''],
      preco: [0]
    });
  }

  salvar() {
    console.log(this.form.value); // debug

    this.service.createProduto(this.form.value).subscribe({
      next: () => {
        alert('Produto criado!');
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar produto');
      }
    });
  }
}
