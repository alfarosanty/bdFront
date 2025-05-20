import { Component } from '@angular/core';
//para el combo
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { ArticuloPrecio } from 'src/app/models/articulo-precio.model';
import { Articulo } from 'src/app/models/articulo.model';
import { Cliente } from 'src/app/models/cliente';
//fin para combo
import { Stock } from 'src/app/models/stock.model';
import { ArticuloService } from 'src/app/services/articulo.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent {
  stocks?: Stock[];
  currentStock: Stock = {};
  currentIndex = -1;
  producto = '';
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>= new Observable<string[]>();

  articulosPrecio?: ArticuloPrecio[];
  articulos?: Articulo[];

  constructor(private stockService: StockService,private articuloService: ArticuloService) {}

  ngOnInit(): void {
    
    this.retrieveStocks();

    this.articuloService.getAllArticuloPrecio().subscribe({
      next: (data) => {
        this.articulosPrecio = data; 
        for (let i = 0; i < this.articulosPrecio?.length; i++) {
          let item = this.articulosPrecio[i];
          if(item.codigo && item.descripcion)
            this.options.push(item.codigo + ' ' + item.descripcion);
          console.log(item);
          }
          console.log('items options ' +  this.options.length);       
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  
   
    this.filteredOptions = this.myControl.valueChanges.pipe(startWith(''),map(value => this._filter(value)));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  retrieveStocks(): void {
    this.stockService.getAll().subscribe({
      next: (data) => {
        this.stocks = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveStocks();
    this.currentStock = {};
    this.currentIndex = -1;
  }

  setActiveStock(stock: Stock, index: number): void {
    this.currentStock = stock;
    this.currentIndex = index;
  }

  removeAllStock(): void {
    this.stockService.deleteAll().subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchStock(): void {
    this.currentStock = {};
    this.currentIndex = -1;

    this.stockService.findByProducto(this.producto).subscribe({
      next: (data) => {
        this.stocks = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

}