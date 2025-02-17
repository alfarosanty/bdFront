import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStockComponent } from './components/add-stock/add-stock.component'
import { StockDetailsComponent } from './components/stock-details/stock-details.component'
import { StockListComponent } from './components/stock-list/stock-list.component'


const routes: Routes = [
  { path: '', redirectTo: 'listStock', pathMatch: 'full' },
  { path: 'addStock', component: AddStockComponent },
  { path: 'viewStock', component: StockDetailsComponent },
  { path: 'listStock', component: StockListComponent },
  { path: 'listStock/:id', component: StockDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
