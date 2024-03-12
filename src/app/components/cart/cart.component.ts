import { Component, inject } from '@angular/core';
import { CartServicesService, TCartItemList, TCartItem } from '../../services/cart-services/cart-services.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
    cartService = inject(CartServicesService);
    cartItemList: TCartItemList =  this.cartService.listCartItems();

    onClickIncreaseQuantity(cartItem: TCartItem): void {
        this.increaseQuantity(cartItem);
    }

    onClickDecreaseQuantity(cartItem: TCartItem): void {
        this.decreaseQuantity(cartItem);
    }

    decreaseQuantity(cartItem: TCartItem): void {
        this.cartService.decreaseProduct(cartItem.product);
    }

    increaseQuantity(cartItem: TCartItem): void {
        this.cartService.addProduct(cartItem.product)
    }


}
