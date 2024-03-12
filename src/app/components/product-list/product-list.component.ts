import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TProductList } from '../../services/product-list-service/product-list-service.service';
import { ProductListServiceService } from '../../services/product-list-service/product-list-service.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})

export class ProductListComponent implements OnInit{
    productListService = inject(ProductListServiceService);
    productList: TProductList | undefined;

    ngOnInit(): void {
        this.productList = this.productListService.getProducts();
    }

    showDetail(): void {

    }
}
