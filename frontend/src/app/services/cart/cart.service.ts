import { Injectable, inject, signal } from '@angular/core';
import { TProduct } from '../product/product.service';
import { HttpClient } from '@angular/common/http';
import { API_CART_INFO, API_CART_ITEM, API_CART_ITEMS, HTTP_DELETE, HTTP_GET, HTTP_PATCH, HTTP_POST } from '../../shared/constants';

export type TCartItem = {
    uuid?: string,
    cart_uuid: string,
    product_uuid: string,
    quantity: number,
    product_name: string,
    description: string,
    price: number,
    stock_remaining: number,
    img_src: string,
}

type TCartInfo = {
    uuid: string
}

export type TCartItemList = TCartItem[];



@Injectable({
  providedIn: 'root'
})
export class CartService {
    private httpClient: HttpClient = inject(HttpClient);
    cartItems = signal<TCartItemList | undefined>(undefined);
    cartUUID : string | undefined;

    addProductToCart(product: TProduct): void {
        if (this.cartUUID) {

            const cartItem: TCartItem = {
                cart_uuid :  this.cartUUID, 
                product_uuid : product.uuid,
                quantity : 1,
                product_name : product.product_name,
                description : product.description,
                price : product.price,
                stock_remaining : product.stock_remaining,
                img_src : product.img_src
            };
            
            let cartItems = this.cartItems();

            if (cartItems) {
                let found = cartItems.find(item => item.product_uuid === product.uuid);

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

    increaseItemQuantity(cartItem: TCartItem): void {
        cartItem.quantity += 1;
        this.updateCartItem(cartItem);
    }

    decreaseItemQuantity(cartItem: TCartItem): void {
        cartItem.quantity -= 1;

        if (cartItem.quantity === 0) {
            this.deleteCartItem(cartItem);

        } else {
            this.updateCartItem(cartItem);
        }
    }

    updateCartItem(cartItem: TCartItem): void {
        const URL = `${API_CART_ITEM}${cartItem.uuid}`;

        const callback = {
            next: () => {
                this.getCartItems();
            },
            error: (error: any) => {
                console.log(error);
            }
        }
        this.queryAPI(HTTP_PATCH, URL, callback, {"cartItem" : cartItem});
    }

    postCartItem(cartItem: TCartItem): void {
        const callback = {
            next: () => {
                this.getCartItems();
                console.log("added product to cart");
            },
            error: (error: any) => {
                console.log(error);
            }
        }

        this.queryAPI(HTTP_POST, API_CART_ITEM, callback, {"cartItem" : cartItem});
    }

    getCartId(): void {
        const callback = {
            next: (cartInfo: TCartInfo) => {
                this.cartUUID = cartInfo?.uuid;
            },
            error: (error: any) => {
                console.log(error);
            }
        };
        this.queryAPI<TCartInfo>(HTTP_GET, API_CART_INFO, callback);
    }

    getCartItems(): void {
        const callback = {
            next: (cartItems: TCartItemList) => {
                this.cartItems.set(cartItems.length > 0 ? cartItems : undefined);
            },
            error: (error: any) => {
                console.log(error);
            },
        };
        this.queryAPI<TCartItemList>(HTTP_GET, API_CART_ITEMS, callback);
    }

    deleteCartItem(cartItem: TCartItem): void {
        const URL = `${API_CART_ITEM}${cartItem.uuid}`

        const callback = {
            next: () => {
                this.getCartItems();
            },
            error: (error: any) => {
                console.log(error);
            }
        }
        this.queryAPI(HTTP_DELETE, URL, callback);
    }

    computeTotalPrice(): number {
        let cartItems = this.cartItems()

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


    queryAPI<T>(requestType: number, URL: string, callback: {next: (res: T) => void, error: (error: any) => void}, payload?: any ): void {
        switch(requestType) {
            case HTTP_GET:
                this.httpClient.get<T>(URL).subscribe(callback);
                break;
            case HTTP_POST: 
                this.httpClient.post<T>(URL, payload).subscribe(callback);
                break;
            case HTTP_PATCH: 
                this.httpClient.patch<T>(URL, payload).subscribe(callback);
            break;
            case HTTP_DELETE:
                this.httpClient.delete<T>(URL).subscribe(callback);
                break;
            default: 
                console.log("error: unkown request type")
        }
    }
}
