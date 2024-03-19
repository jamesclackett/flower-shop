import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { API_URL_IMAGE } from '../../shared/constants';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent {
    private productService = inject(ProductService);
    productList = this.productService.productList;
    imageURL = API_URL_IMAGE;
    dummyArray = [0,0,0,0];
}
