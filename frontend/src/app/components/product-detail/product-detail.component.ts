import { Component, Input, OnInit, inject, Signal, OnDestroy, signal, ChangeDetectorRef} from '@angular/core';
import { ProductService, TProduct } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
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
    private productService = inject(ProductService);
    private cartService = inject(CartService);
    private userService = inject(UserService);
    
    imageURL = API_URL_IMAGE;
    product = this.productService.product;

    ngOnInit(): void { 
        this.productService.setProductId(this.id); 
        this.cartService.getCartItems();
        this.cartService.getCartId();
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
            this.cartService.addProductToCart(product);
        }
    }
   
}
