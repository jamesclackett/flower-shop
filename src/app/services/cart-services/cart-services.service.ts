import { Injectable, inject } from '@angular/core';
import { ProductListServiceService, TProduct } from '../product-list-service/product-list-service.service';

type TCartItem = {
    quantity: number,
    product: TProduct
}

type TCartItemList = TCartItem[];


@Injectable({
  providedIn: 'root'
})
export class CartServicesService {
    productListService = inject(ProductListServiceService);
    cartItemList: TCartItemList = [];

  addProduct(product: TProduct) {
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
    // console.log("there are", )
  }

  removeProduct(id: string) {
    const index = this.cartItemList.findIndex((cartItem) => cartItem.product.id === id);
    this.cartItemList.splice(index, 1);
  }

  listCartItems(): TCartItemList{
    return this.cartItemList;
  }
}
