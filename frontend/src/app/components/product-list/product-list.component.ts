import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListServiceService } from '../../services/product-list-service/product-list-service.service';
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
    private productListService = inject(ProductListServiceService);
    productList = this.productListService.productList;
    imageURL = API_URL_IMAGE;
    dummyArray = [0,0,0,0];
}
