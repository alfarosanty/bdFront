import { Component, Input, OnInit } from '@angular/core';
import { StockService } from 'src/app/services/stock.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Stock } from 'src/app/models/stock.model';

@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css']
})
export class StockDetailsComponent {

  @Input() viewMode = false;

  @Input() currentStock: Stock = {
    id: '',
    producto: '',
    cantidad: '',
    baja: false
  };

  message = '';

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getStock(this.route.snapshot.params['id']);
    }
  }

  getStock(id: string): void {
    console.log("Stock seleccionado: " + id);
    this.stockService.get(id).subscribe({
      next: (data) => {
        this.currentStock = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  updateBorrado(status: boolean): void {
    const data = {
      id: this.currentStock.id,
      producto: this.currentStock.producto,
      cantidad: this.currentStock.cantidad,
      baja: status
    };
    
    console.log("Estado: " + data); 

    this.message = '';

    this.stockService.update(this.currentStock.id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.currentStock.baja = status;
        this.message = res.message
          ? res.message
          : 'Actualizado!';
      },
      error: (e) => console.error(e)
    });
  }

  updateStock(): void {
    this.message = '';

    this.stockService
      .update(this.currentStock.id, this.currentStock)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message
            ? res.message
            : 'Actualizado!';
        },
        error: (e) => console.error(e)
      });
  }

  deleteStock(): void {
    this.stockService.delete(this.currentStock.id).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/listStock']);
      },
      error: (e) => console.error(e)
    });
  }
}
