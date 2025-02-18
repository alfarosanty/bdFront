import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddStockComponent } from './components/add-stock/add-stock.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { StockListComponent } from './components/stock-list/stock-list.component';
import { SearchBudgetComponent } from './components/search-budget/search-budget.component';

@NgModule({
  declarations: [
    AppComponent,
    AddStockComponent,
    StockDetailsComponent,
    StockListComponent,
    SearchBudgetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
