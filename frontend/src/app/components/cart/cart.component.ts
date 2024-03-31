import { Component, OnDestroy, OnInit, Signal, inject } from '@angular/core';
import { CartService, TCartItem, TCartItemList } from '../../services/cart/cart.service';
import { API_IMAGE } from '../../shared/constants';
import { UserService } from '../../services/user/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent  implements OnInit, OnDestroy {
    userService: UserService = inject(UserService);
    cartService: CartService = inject(CartService);
    router: Router = inject(Router);
    cartItems: Signal<TCartItemList | undefined> = this.cartService.cartItems;
    loggedInSubscription: Subscription = new Subscription;
    imageURL: string = API_IMAGE;

    ngOnDestroy(): void {
        this.loggedInSubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.cartService.cartItems.set(undefined);
        this.loggedInSubscription = this.userService.isLoggedIn().subscribe((isLoggedIn) => {
            if (isLoggedIn) {
                this.cartService.getCartItems();
                this.cartService.getCartId();
            } else {
                this.router.navigate(['user/login']);
            }
        });
        
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
        this.cartService.deleteCartItem(cartItem);
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
