import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { TProduct } from '../product-list-service/product-list-service.service';
import { HttpClient } from '@angular/common/http';
import { Subscription, take } from 'rxjs';
import { UserService } from '../user/user.service';
import { API_URL_USER, HTTP_GET, HTTP_DELETE, HTTP_PATCH, HTTP_POST } from '../../shared/constants';

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
             `${API_URL_USER}${this.userService.getUserId()}/cart/${cartItem.cart_id}/${cartItem.id}`;

             this.queryAPI(HTTP_PATCH, URL, () => this.getCartItems(), {"cartItem" : cartItem});
        }
    }

    postCartItem(cartItem: TCartItem) {
        if(this.userService.isLoggedIn()) {
            const URL =
             `${API_URL_USER}${this.userService.getUserId()}/cart/${cartItem.cart_id}`;

            this.queryAPI(HTTP_POST, URL, () => this.getCartItems(), {"cartItem" : cartItem})
        }
    }

    getCartId() {
        if (this.userService.isLoggedIn()) {
            const URL = `${API_URL_USER}${this.userService.getUserId()}/cart/info`;

            const callback = (cartInfo: TCartInfo) => {
                if (cartInfo) this.cartId = cartInfo.id;
            }

            this.queryAPI(HTTP_GET, URL, callback);
        }
    }

    getCartItems() {
        if (this.userService.isLoggedIn()) {
            const URL = `${API_URL_USER}${this.userService.getUserId()}/cart`;

            const callback = (cartItems: TCartItemList) => {
                if (cartItems.length > 0) {
                    this.cartItems.set(cartItems);
                } else this.cartItems.set(undefined);
            }
            this.queryAPI(HTTP_GET, URL, callback);
        }
    }

    deleteItem(cartItem: TCartItem): void {
        if(this.userService.isLoggedIn()) {
            console.log("hello")
            const URL =
             `${API_URL_USER}${this.userService.getUserId()}/cart/${cartItem.cart_id}/${cartItem.id}`

            this.queryAPI(HTTP_DELETE, URL, () => this.getCartItems());
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


    queryAPI<T>(requestType: number, URL: string, callback?: (() => void) | ((arg: T) => void), payload?: any ) {

        switch(requestType) {
            case HTTP_GET:
                this.apiSubscription = this.httpClient.get<T>(URL).pipe(take(1)).subscribe(callback);
                break;
            case HTTP_POST: 
                this.apiSubscription = this.httpClient.post<T>(URL, payload).pipe(take(1)).subscribe(callback);
                break;
            case HTTP_PATCH: 
                this.apiSubscription = this.httpClient.patch<T>(URL, payload).pipe(take(1)).subscribe(callback);
            break;
            case HTTP_DELETE:
                this.apiSubscription =  this.httpClient.delete<T>(URL).pipe(take(1)).subscribe(callback);
                break;
            default: 
                console.log("error: unkown request type")
        }
    }
}
