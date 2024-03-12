import { Injectable } from '@angular/core';

export type TProduct = {
    id: string,
    name: string;
    price: number;
    desc: string;
    quantity: number;
}

export type TProductList = TProduct[]

@Injectable({
  providedIn: 'root'
})

export class ProductListServiceService {
    productList: TProductList = [
        {   id: '1',
            name:  'yellow',
            price: 29.99,
            desc: 'yellow flower',
            quantity: 23
        }, 
        {   id: '2',
            name:  'lilly',
            price: 11,
            desc: 'lilly flower',
            quantity: 1
        }, 
        {   id: '3',
            name:  'rose',
            price: 30,
            desc: 'red rose',
            quantity: 63
        }
    ];

  getProductById(id: string): TProduct | undefined  {
    return this.productList.find((p)=> p.id ===id);
  } 

  getProducts(): TProductList {
    return this.productList;
  }

  decreaseQuantity(id: string) {
    this.productList= this.productList.map((product) => {
        if(product.id === id) {
            if (product.quantity > 0)
                product.quantity--;
            else console.log("No more stock left (cannot decrease)")
        }
        return product;
    });
  }

  increaseQuantity(id: string) {
    this.productList= this.productList.map((product) => {
        if(product.id === id) {
            product.quantity++;
        }
        return product;
    });
  }
}
