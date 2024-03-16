import { Injectable, OnInit, Signal, computed, inject, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { API_URL_PRODUCT, API_URL_PRODUCTS } from '../../shared/constants';
import { switchMap } from 'rxjs';

export type TProduct = {
    id: number,
    product_name: string;
    price: number;
    description: string;
    stock_remaining: number;
    img_src: string;
    created_at: number;
}

export type TProductList = TProduct[]

@Injectable({
  providedIn: 'root'
})

export class ProductListServiceService {
    private productId = signal('-1');
    private httpClient: HttpClient = inject(HttpClient);

    product$ = toObservable(this.productId).pipe(
        switchMap(productId => this.httpClient.get<TProduct[]>(API_URL_PRODUCT + productId)))
    product = toSignal(this.product$);
    // ASK XIN WHY THIS WORKS 

    private productList$ = this.httpClient.get<TProductList>(API_URL_PRODUCTS);
    productList = toSignal(this.productList$);


    setProductId(id: string) {
        this.productId.set(id);
    }

    decreaseQuantity(id: string) {
        // NOTE: Does not persist!
        // let productList = this.productListSignal();
        // if (productList) {
        //     productList= productList.map((product) => {
        //         if(product.id === id) {
        //             if (product.stock_remaining > 0)
        //                 product.stock_remaining--;
        //             else console.log("No more stock left (cannot decrease)")
        //         }
        //         return product;
        //     });
        // }
    }

    increaseQuantity(id: string) {
        // NOTE: Does not persist!
        // let productList = this.productListSignal();
        // if (productList) {
        //     productList= productList.map((product) => {
        //         if(product.id === id) {
        //             product.stock_remaining++;
        //         }
        //         return product;
        //     });
        // }
    }
}
