import { Component, Input, OnInit, inject, Signal, OnDestroy, signal, ChangeDetectorRef} from '@angular/core';
import { ProductListServiceService, TProduct } from '../../services/product-list-service/product-list-service.service';
import { CartServicesService } from '../../services/cart-services/cart-services.service';
import { API_URL_IMAGE } from '../../shared/constants';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscriber, Subscription } from 'rxjs';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})


export class ProductDetailComponent implements OnInit {
    @Input() 
    private id = ''
    private productListService = inject(ProductListServiceService);
    private cartService = inject(CartServicesService);
    private userService = inject(UserService);
    
    imageURL = API_URL_IMAGE;
    product = this.productListService.product;

    ngOnInit(): void { 
        this.productListService.setProductId(this.id); 
        this.cartService.getCartItems();
    }

    onClickAddToCart() { 
        if (this.userService.isLoggedIn()) {
            this.addToCart();
        } else {
            console.log("You must log in first")
        }
         
    }

    private addToCart() {
        let product = this.product();
        if (product) {
            this.cartService.addProductToCart(product[0]);
        }
    }
   
}
