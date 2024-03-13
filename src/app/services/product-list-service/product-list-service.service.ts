import { Injectable, inject, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

export type TProduct = {
    id: string,
    name: string;
    price: number;
    desc: string;
    quantity: number;
    imageUrl: string;
}

export type TProductList = TProduct[]

@Injectable({
  providedIn: 'root'
})

export class ProductListServiceService {
    httpClient: HttpClient = inject(HttpClient);
    productList$ = this.httpClient.get<TProductList>('http://localhost:8000/product-list');
    productListSignal = toSignal(this.productList$);

  getProductById(id: string): TProduct | undefined {
    let productList = this.productListSignal();
    if (productList) {
        return productList.find((p)=> p.id ===id);
    }
    return undefined;
  } 

  getProducts(): TProductList | undefined {
    let productList = this.productListSignal();
    if (productList) {
        return productList;
    }
    return undefined; 
  }

  decreaseQuantity(id: string) {
    // NOTE: Does not persist!
    let productList = this.productListSignal();
    if (productList) {
        productList= productList.map((product) => {
            if(product.id === id) {
                if (product.quantity > 0)
                    product.quantity--;
                else console.log("No more stock left (cannot decrease)")
            }
            return product;
        });
    }
  }

  increaseQuantity(id: string) {
    // NOTE: Does not persist!
    let productList = this.productListSignal();
    if (productList) {
        productList= productList.map((product) => {
            if(product.id === id) {
                product.quantity++;
            }
            return product;
        });
    }
  }
}
