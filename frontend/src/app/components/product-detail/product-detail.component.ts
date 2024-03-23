import { Component, Input, OnDestroy, OnInit, Signal, WritableSignal, inject} from '@angular/core';
import { ProductService, TProduct } from '../../services/product/product.service';
import { CartService } from '../../services/cart/cart.service';
import { API_URL_IMAGE } from '../../shared/constants';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})


export class ProductDetailComponent implements OnInit, OnDestroy {
    @Input() private uuid: string = '';
    private productService: ProductService = inject(ProductService);
    private cartService: CartService = inject(CartService);
    private userService: UserService= inject(UserService);
    
    imageURL: string = API_URL_IMAGE;
    product: WritableSignal<TProduct | undefined> = this.productService.product;

    ngOnInit(): void { 
        this.productService.setProductSignal(this.uuid); 
        this.cartService.getCartItems();
        this.cartService.getCartId();
    }

    ngOnDestroy(): void {
        this.product.set(undefined);
    }

    onClickAddToCart(): void { 
        if (this.userService.isLoggedIn()) {
            this.addToCart();
        } else {
            console.log("You must log in first")
        }
    }

    private addToCart(): void {
        let product = this.product();
        if (product) {
            this.cartService.addProductToCart(product);
        }
    }
   
}
