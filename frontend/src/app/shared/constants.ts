// SERVICES:
export const AUTH_API = 'http://localhost:8000/auth/';
export const CART_API = 'http://localhost:8001/cart/';
export const MEDIA_API = 'http://localhost:8002/media/';
export const PRODUCT_API = 'http://localhost:8003/';
export const USER_API = 'http://localhost:8004/user/';

// RESOURCE FULL URLS:
export const API_LOGIN = AUTH_API + 'login';
export const API_REGISTER = AUTH_API + 'register';
export const API_IMAGE = MEDIA_API + 'image/';
export const API_PRODUCTS = PRODUCT_API + 'products/';
export const API_PRODUCT = PRODUCT_API + 'product/'; 
export const API_CART_ITEMS = CART_API + 'items/';
export const API_CART_INFO = CART_API + 'info/';
export const API_CART_ITEM = CART_API + 'item/';

// HTTP REQUEST CONSTANTS:
export const HTTP_GET = 0;
export const HTTP_POST = 1;
export const HTTP_PATCH = 2;
export const HTTP_DELETE = 3;


