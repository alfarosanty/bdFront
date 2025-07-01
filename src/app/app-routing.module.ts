import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStockComponent } from './components/add-stock/add-stock.component'
import { StockDetailsComponent } from './components/stock-details/stock-details.component'
import { StockListComponent } from './components/stock-list/stock-list.component'
import { SearchBudgetComponent } from './components/search-budget/search-budget.component';
import { SelectBudgetComponent } from './components/select-budget/select-budget.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { PedidoProduccionComponent } from './components/pedido-produccion/pedido-produccion.component';
import { IngresoComponent } from './components/ingreso/ingreso.component';
import { RevisionPedidosProduccionComponent } from './components/revision-pedidos-produccion/revision-pedidos-produccion.component';
import { SeparacionProductosComponent } from './components/separacion-productos/separacion-productos.component';
import { PresentacionComponent } from './components/presentacion/presentacion.component';
import { ArticuloConfiguracionComponent } from './components/articulo-configuracion/articulo-configuracion.component';


const routes: Routes = [
  { path: '', component: PresentacionComponent },
  { path: 'addStock', component: AddStockComponent },
  { path: 'viewStock', component: StockDetailsComponent },
  { path: 'listStock', component: StockListComponent },
  { path: 'listStock/:id', component: StockDetailsComponent },
  { path:  'searchBudget', component: SearchBudgetComponent},
  { path:  'searchBudget/:id', component: SearchBudgetComponent},
  { path:  'selectBudget', component: SelectBudgetComponent},
  { path:  'clientes', component: ClientesComponent},
  { path:  'facturacion', component: FacturacionComponent},
  { path:  'pedidoProduccion', component: PedidoProduccionComponent},
  { path:  'ingreso', component: IngresoComponent},
  { path:  'revisionPedidoProduccion', component: RevisionPedidosProduccionComponent},
  { path:  'seleccionarPresupuesto/:id', component: SeparacionProductosComponent},
  { path:  'configuracionArticulo', component: ArticuloConfiguracionComponent},








];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
