import { Component, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, TProductList } from '../../services/product/product.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { API_IMAGE } from '../../shared/constants';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent {
    private productService = inject(ProductService);
    productList: Signal<TProductList | undefined> = this.productService.productList;
    imageURL: string = API_IMAGE;
    dummyArray: number[] = [0,0,0,0];
}
