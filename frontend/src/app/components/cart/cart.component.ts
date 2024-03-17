import { Component, OnInit, inject } from '@angular/core';
import { CartServicesService, TCartItem } from '../../services/cart-services/cart-services.service';
import { API_URL_IMAGE } from '../../shared/constants';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent  implements OnInit {
    cartService = inject(CartServicesService);
    cartItems = this.cartService.cartItems;
    imageURL = API_URL_IMAGE;

    ngOnInit(): void {
        this.cartService.getCartItems();
        this.cartService.getCartId();
    }

    onClickIncreaseItemQuantity(cartItem: TCartItem): void {
        this.increaseItemQuantity(cartItem);
    }

    onClickDecreaseItemQuantity(cartItem: TCartItem): void {
        this.decreaseItemQuantity(cartItem);
    }

    onClickDeleteItem(cartItem: TCartItem): void {
        this.deleteItem(cartItem);
    }

    deleteItem(cartItem: TCartItem): void {
        this.cartService.deleteItem(cartItem);
    }

    decreaseItemQuantity(cartItem: TCartItem): void {
        this.cartService.decreaseItemQuantity(cartItem);
    }

    increaseItemQuantity(cartItem: TCartItem): void {
        this.cartService.increaseItemQuantity(cartItem);
    }

    getTotalPrice(): number {
        return this.cartService.computeTotalPrice()
    }
}
