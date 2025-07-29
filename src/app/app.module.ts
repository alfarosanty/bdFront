import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddStockComponent } from './components/add-stock/add-stock.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { StockListComponent } from './components/stock-list/stock-list.component';


import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';





import { DragDropModule } from '@angular/cdk/drag-drop';



import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientesComponent } from './components/clientes/clientes.component';
import { EditarGenericoDialogPedidoProduccionComponent, PedidoProduccionComponent } from './components/pedido-produccion/pedido-produccion.component';
import { EditarGenericoDialogIngresoComponent, IngresoComponent } from './components/ingreso/ingreso.component';
import { RevisionPedidosProduccionComponent } from './components/revision-pedidos-produccion/revision-pedidos-produccion.component';
import { SeparacionProductosComponent } from './components/separacion-productos/separacion-productos.component';
import { PresentacionComponent } from './components/presentacion/presentacion.component';
import { EditarGenericoDialogComponent, SearchBudgetComponent } from './components/search-budget/search-budget.component';
import { EditarGenericoDialogFacturacionComponent, FacturacionComponent } from './components/facturacion/facturacion.component';
import { SelectBudgetComponent } from './components/select-budget/select-budget.component';
import { ArticuloConfiguracionComponent } from './components/articulo-configuracion/articulo-configuracion.component';
import { RevisionFacturaComponent } from './components/revision-factura/revision-factura.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { MatSortModule } from '@angular/material/sort';
import { ActualizacionPreciosComponent } from './components/actualizacion-precios/actualizacion-precios.component';



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
    IngresoComponent,
    RevisionPedidosProduccionComponent,
    SeparacionProductosComponent,
    EditarGenericoDialogComponent,
    EditarGenericoDialogFacturacionComponent,
    EditarGenericoDialogIngresoComponent,
    EditarGenericoDialogPedidoProduccionComponent,
    PresentacionComponent,
    ArticuloConfiguracionComponent,
    RevisionFacturaComponent,
    EstadisticasComponent,
    ActualizacionPreciosComponent,
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
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSortModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
