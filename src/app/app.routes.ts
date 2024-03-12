import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
    { path: 'product-list', component: ProductListComponent},
    { path: 'product-detail/:id', component: ProductDetailComponent }
];
