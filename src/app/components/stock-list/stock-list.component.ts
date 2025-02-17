import { Component } from '@angular/core';
import { Stock } from 'src/app/models/stock.model';
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

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.retrieveStocks();
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
