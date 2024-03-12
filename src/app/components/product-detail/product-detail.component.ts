import { Component, OnInit, inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductListServiceService, TProduct } from '../../services/product-list-service/product-list-service.service';
import { CartServicesService } from '../../services/cart-services/cart-services.service';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass'
})


export class ProductDetailComponent implements OnInit {
    productListService = inject(ProductListServiceService);
    cartService = inject(CartServicesService);
    activatedRoute = inject(ActivatedRoute);
    product: TProduct | undefined;

    id: string | null = "-1";

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        if (this.id) {
            this.product = this.productListService.getProductById(this.id);
            console.log(this.product?.name)
        }
    }

    addToCart() {
        if (this.product) {
            this.cartService.addProduct(this.product);
        }
    }
   
    // @Input() id!: number


}
