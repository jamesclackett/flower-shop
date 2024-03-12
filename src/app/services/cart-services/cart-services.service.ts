import { Injectable, inject } from '@angular/core';
import { ProductListServiceService, TProduct } from '../product-list-service/product-list-service.service';

export type TCartItem = {
    quantity: number,
    product: TProduct
}

export type TCartItemList = TCartItem[];


@Injectable({
  providedIn: 'root'
})
export class CartServicesService {
    productListService = inject(ProductListServiceService);
    cartItemList: TCartItemList = [];

  addProduct(product: TProduct) {
    if (product.quantity < 1) {
        console.log("cannot add to cart (no stock left)")
        return;
    }

    let found = false;
    this.cartItemList = this.cartItemList.map((cartItem) => {
        if(cartItem.product.id === product.id) {
            cartItem.quantity++;
            found = true;
            this.productListService.decreaseQuantity(product.id);
        }
        return cartItem;
    });

    if(!found) {
        this.cartItemList.push({ product, quantity: 1 });
    }
    console.log("added to cart!")

    const quantity = this.productListService.getProductById(product.id)?.quantity;

    console.log("there are", quantity, "units left!");
  }

  decreaseProduct(product: TProduct) {
    this.cartItemList = this.cartItemList.map((cartItem) => {
        if(cartItem.product.id === product.id) {
            cartItem.quantity--;
            if (cartItem.quantity === 0) {
                // code to remove from list
            }

            this.productListService.increaseQuantity(cartItem.product.id);
        }
        return cartItem;
    });
  }

  listCartItems(): TCartItemList{
    return this.cartItemList;
  }
}
