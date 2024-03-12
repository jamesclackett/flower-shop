import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { UserComponent } from './components/user/user.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { UserLoginComponent } from './components/user-login/user-login.component';

export const routes: Routes = [
    { path: '', component: ProductListComponent},
    { path: 'product-detail/:id', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent},
    { path: 'user/:id', component: UserComponent},
    { path: 'user-login', component: UserLoginComponent},
    { path: 'user-registration', component: UserRegistrationComponent}

];
