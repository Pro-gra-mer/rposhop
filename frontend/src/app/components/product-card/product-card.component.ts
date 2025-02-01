import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: Product;
}
