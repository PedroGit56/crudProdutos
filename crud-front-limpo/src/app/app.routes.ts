import { Routes } from '@angular/router';
import { ProdutoComponent } from './pages/produto/produto.component';
import { PedidoComponent } from './pages/pedido/pedido.component';

export const routes: Routes = [
    { path: '', component: ProdutoComponent},
    {path: 'pedido', component: PedidoComponent}
];
