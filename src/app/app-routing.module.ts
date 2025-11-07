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
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { ActualizacionPreciosComponent } from './components/actualizacion-precios/actualizacion-precios.component';
import { VistaGeneralComponent } from './components/vista-general/vista-general.component';
import { ConsultasGeneralComponent } from './components/consultas-general/consultas-general.component';
import { EliminacionesComponent } from './components/eliminaciones/eliminaciones.component';
import { SeleccionClienteComponent } from './components/seleccion-cliente/seleccion-cliente.component';
import { RevisionesIngresosComponent } from './components/revisiones-ingresos/revisiones-ingresos.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { NoPermisoComponent } from './components/no-permiso/no-permiso.component';
import { ListUsuariosComponent } from './components/list-usuarios/list-usuarios.component';


const routes: Routes = [
  { path: '', component: PresentacionComponent },
  { 
    path: 'addStock',
    component: AddStockComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'viewStock', 
    component: StockDetailsComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'listStock', 
    component: StockListComponent, 
    canActivate: [authGuard]
  },
  { 
    path: 'listStock/:id', 
    component: StockDetailsComponent,
    canActivate: [authGuard] 
  },
  { 
    path:  'searchBudget', 
    component: SearchBudgetComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'searchBudget/:id', 
    component: SearchBudgetComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'selectBudget', 
    component: SelectBudgetComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'clientes', 
    component: ClientesComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'clientes/:id', 
    component: ClientesComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'facturacion', 
    component: FacturacionComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'CONTROL_FINANZAS'] }
  },
  { 
    path:  'pedidoProduccion', 
    component: PedidoProduccionComponent,
    canActivate: [authGuard]

  },
  { 
    path:  'ingreso', 
    component: IngresoComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'revisionPedidoProduccion', 
    component: RevisionPedidosProduccionComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'revisionIngreso', 
    component: RevisionesIngresosComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'seleccionarPresupuesto/:id', 
    component: SeparacionProductosComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'configuracionArticulo', 
    component: ArticuloConfiguracionComponent,
    canActivate: [authGuard]
  },
  {
    path:  'estadisticas',
    component: EstadisticasComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  { 
    path:  'actualizacionPrecios', 
    component: ActualizacionPreciosComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'vista', 
    component: VistaGeneralComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'vista/:id', 
    component: VistaGeneralComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'consultasGeneral', 
    component: ConsultasGeneralComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'eliminaciones', 
    component: EliminacionesComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'seleccion-cliente', 
    component: SeleccionClienteComponent,
    canActivate: [authGuard]
  },
  { 
    path:  'login', 
    component: LoginComponent,
  },
  { 
    path: 'no-permission', 
    component: NoPermisoComponent,
    canActivate: [authGuard]

  },
  { 
    path: 'list-usuarios', 
    component: ListUsuariosComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
