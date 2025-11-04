import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

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
import {MatStepperModule} from '@angular/material/stepper';







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
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { MatSortModule } from '@angular/material/sort';
import { ActualizacionPreciosComponent } from './components/actualizacion-precios/actualizacion-precios.component';
import { VistaGeneralComponent } from './components/vista-general/vista-general.component';
import { ConsultasGeneralComponent } from './components/consultas-general/consultas-general.component';
import { EliminacionesComponent } from './components/eliminaciones/eliminaciones.component';
import { SeleccionClienteComponent } from './components/seleccion-cliente/seleccion-cliente.component';
import { RevisionesIngresosComponent } from './components/revisiones-ingresos/revisiones-ingresos.component';
import { RevisionesPresupuestosComponent } from './components/revisiones-presupuestos/revisiones-presupuestos.component';
import { LoginComponent } from './components/login/login.component';
import { NoPermisoComponent } from './components/no-permiso/no-permiso.component';
import { CredentialsInterceptor } from './core/interceptors/credentials.interceptor';



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
    EstadisticasComponent,
    ActualizacionPreciosComponent,
    VistaGeneralComponent,
    ConsultasGeneralComponent,
    EliminacionesComponent,
    SeleccionClienteComponent,
    RevisionesIngresosComponent,
    RevisionesPresupuestosComponent,
    LoginComponent,
    NoPermisoComponent,
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
    MatStepperModule
  ],
  
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
