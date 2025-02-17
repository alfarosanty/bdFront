import { Component } from '@angular/core';
import { Stock } from 'src/app/models/stock.model';
import { StockService } from 'src/app/services/stock.service';
@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent {
  stock: Stock = {
    id: 0,
    producto: '',
    cantidad: 0,
    baja: false
  };
  submitted = false;

  constructor(private stockService: StockService) {}

  saveStock(): void {
    const data = {
      producto: this.stock.producto,
      cantidad: this.stock.cantidad
    };

    this.stockService.create(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
      },
      error: (e) => console.error(e)
    });
  }

  newStock(): void {
    this.submitted = false;
    this.stock = {
      producto: '',
      cantidad: '',
      baja: false
    };
  }
}
