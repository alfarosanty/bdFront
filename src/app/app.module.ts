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
import { SelectBudgetComponent } from './components/select-budget/select-budget.component';


import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientesComponent } from './components/clientes/clientes.component';
import { FacturacionComponent } from './components/facturacion/facturacion.component';
import { PedidoProduccionComponent } from './components/pedido-produccion/pedido-produccion.component';

@NgModule({
  declarations: [
    AppComponent,
    AddStockComponent,
    StockDetailsComponent,
    StockListComponent,
    SearchBudgetComponent,
    SelectBudgetComponent,
    ClientesComponent,
    FacturacionComponent,
    PedidoProduccionComponent,
  ],
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
