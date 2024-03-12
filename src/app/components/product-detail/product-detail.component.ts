import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductListServiceService, TProduct } from '../../services/product-list-service/product-list-service.service';
import { CartServicesService } from '../../services/cart-services/cart-services.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass'
})


export class ProductDetailComponent implements OnInit, OnDestroy {
    productListService = inject(ProductListServiceService);
    cartService = inject(CartServicesService);
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    product: TProduct | undefined;
    activeRouteSubscription: Subscription = new Subscription();

    id: string | null = "-1";

    onClickAddToCart() {
        this.addToCart();
    }

    ngOnInit(): void {
        this.activeRouteSubscription = this.activatedRoute.params.subscribe((param) => {
            if (param['id']) {
                this.product = this.productListService.getProductById(param['id']);
                console.log(this.product?.name)
        }
        });
    }

    ngOnDestroy() {
        this.activeRouteSubscription.unsubscribe();
    }

    addToCart() {
        if (this.product) {
            this.cartService.addProduct(this.product);
        }
    }
   
}
