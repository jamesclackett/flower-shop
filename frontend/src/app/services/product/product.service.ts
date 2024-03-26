import { Injectable, Signal, computed, WritableSignal, inject, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { API_PRODUCTS, API_PRODUCT } from '../../shared/constants';
import { switchMap } from 'rxjs';

export type TProduct = {
    uuid: string,
    product_name: string;
    price: number;
    description: string;
    stock_remaining: number;
    img_src: string;
}

export type TProductList = TProduct[]

@Injectable({
  providedIn: 'root'
})

export class ProductService {
    private httpClient: HttpClient = inject(HttpClient);
    private productList$ = this.httpClient.get<TProductList>(API_PRODUCTS);
    productList: Signal<TProductList | undefined> = toSignal(this.productList$);

    product: WritableSignal<TProduct | undefined> = signal(undefined);

    setProductSignal(uuid: string): void {
        const product$ = this.httpClient.get<TProduct>(API_PRODUCT + uuid);
        product$.subscribe(data => this.product.set(data));
    }

}
