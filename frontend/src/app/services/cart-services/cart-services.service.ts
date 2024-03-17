import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { TProduct } from '../product-list-service/product-list-service.service';
import { HttpClient } from '@angular/common/http';
import { Subscription, take } from 'rxjs';
import { UserService } from '../user/user.service';
import { API_URL_USER } from '../../shared/constants';

export type TCartItem = {
    id: number,
    cart_id: number,
    product_id: number,
    quantity: number,
    product_name: string,
    description: string,
    price: number,
    stock_remaining: number,
    img_src: string,
    created_at: number   
}

type TCartInfo = {
    id: number
}

export type TCartItemList = TCartItem[];



@Injectable({
  providedIn: 'root'
})
export class CartServicesService implements OnDestroy {
    private userService: UserService = inject(UserService);
    private httpClient: HttpClient = inject(HttpClient);
    private apiSubscription = new Subscription;
    cartItems = signal<TCartItemList | undefined>(undefined);
    cartId : number | undefined;

    ngOnDestroy(): void {
        this.apiSubscription.unsubscribe();
    }

    addProductToCart(product: TProduct) {
        if (this.cartId) {

            const cartItem: TCartItem = {
                id:  -1, 
                cart_id :  this.cartId, 
                product_id : product.id,
                quantity : 1,
                product_name : product.product_name,
                description : product.description,
                price : product.price,
                stock_remaining : product.stock_remaining,
                img_src : product.img_src,
                created_at: Date.now() / 1000
            };
            
            let cartItems = this.cartItems();

            if (cartItems) {
                let found = cartItems.find(item => item.product_id === product.id);

                if (!found) {
                    this.postCartItem(cartItem);
                } else {
                    this.increaseItemQuantity(found);
                }
            } else {
                this.postCartItem(cartItem);
            }
        }
    }

    increaseItemQuantity(cartItem: TCartItem) {
        cartItem.quantity += 1;
        this.updateCartItem(cartItem);
    }

    decreaseItemQuantity(cartItem: TCartItem) {
        cartItem.quantity -= 1;

        if (cartItem.quantity === 0) {
            this.deleteItem(cartItem);

        } else {
            this.updateCartItem(cartItem);
        }
    }

    updateCartItem(cartItem: TCartItem) {
        if(this.userService.isLoggedIn()) {
            const URL =
             `${API_URL_USER}${this.userService.getUserId()}/cart/${cartItem.cart_id}/${cartItem.id}`
             
            this.apiSubscription =  this.httpClient.patch<TCartItemList>(URL, {"cartItem" : cartItem}).pipe(take(1)).subscribe(
                () => {this.getCartItems()}
            )
        }
    }

    postCartItem(cartItem: TCartItem) {
        if(this.userService.isLoggedIn()) {
            const URL =
             `${API_URL_USER}${this.userService.getUserId()}/cart/${cartItem.cart_id}`
            this.apiSubscription =  this.httpClient.post<TCartItemList>(URL, {"cartItem" : cartItem}).pipe(take(1)).subscribe(
                () => {this.getCartItems()}
            )
        }
    }

    getCartId() {
        if (this.userService.isLoggedIn()) {
            const URL = `${API_URL_USER}${this.userService.getUserId()}/cart/info`;
            this.apiSubscription = this.httpClient.get<TCartInfo>(URL).pipe(take(1)).subscribe(
                (cartInfo) => {
                    if (cartInfo) {
                        this.cartId = cartInfo.id;
                    }
                }
            )
        }
    }

    getCartItems() {
        if (this.userService.isLoggedIn()) {
            const URL = `${API_URL_USER}${this.userService.getUserId()}/cart`;
            this.apiSubscription =  this.httpClient.get<TCartItemList>(URL).pipe(take(1)).subscribe(
                (cartItems) => { 
                    if (cartItems.length > 0) {
                        this.cartItems.set(cartItems);
                    } else this.cartItems.set(undefined);
                }
            )
        }
    }

    deleteItem(cartItem: TCartItem): void {
        if(this.userService.isLoggedIn()) {
            console.log("hello")
            const URL =
             `${API_URL_USER}${this.userService.getUserId()}/cart/${cartItem.cart_id}/${cartItem.id}`
             
            this.apiSubscription =  this.httpClient.delete<TCartItemList>(URL).pipe(take(1)).subscribe(
                () => {this.getCartItems()}
            )
        }
    }

    computeTotalPrice(): number {
        let cartItems = this.cartItems();
        if (cartItems) {
            let total: number = 0;  
            for (let item of cartItems) {
                const price = item.price * item.quantity;
                total += price;
            }
            return total;
        }
        return 0;
    }
}
