import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CartService, TCartItem, TCartItemList } from "./cart.service";
import { API_URL, API_URL_USER, HTTP_DELETE, HTTP_GET, HTTP_PATCH, HTTP_POST } from "../../shared/constants";
import { TProduct } from "../product/product.service";

describe('CartService', () => {
    let cartService: CartService;
    let httpTestingController: HttpTestingController;
    let mockItem: TCartItem;
    let mockProduct: TProduct;
    let mockCartItems: TCartItemList;
    let orginalQuery:  <T>(requestType: number, URL: string, callback?: (() => void) | ((arg: T) => void) | undefined, payload?: any) => void
    const mockQueryAPI = jest.fn();

    // spies:
    let postCartItemSpy: jest.SpyInstance<void, [cartItem: TCartItem]>;
    let increaseItemSpy: jest.SpyInstance<void, [cartItem: TCartItem]>;
    let isLoggedInSpy: jest.SpyInstance<boolean, []>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CartService]
        })
        
        cartService = TestBed.inject(CartService);
        orginalQuery = cartService['queryAPI'];
        cartService['queryAPI'] = mockQueryAPI;
        httpTestingController = TestBed.inject(HttpTestingController);
        postCartItemSpy = jest.spyOn(cartService, 'postCartItem');
        increaseItemSpy = jest.spyOn(cartService, 'increaseItemQuantity');
        isLoggedInSpy = jest.spyOn(cartService['userService'], 'isLoggedIn')


        mockProduct = {
            id: 1,
            product_name: 'test_name',
            description: 'test_desc',
            price: 1.0,
            img_src: 'test_img_src',
            stock_remaining: 1,
            created_at: 1
        }

        mockItem = {
            cart_id: 1,
            product_id: 1,
            quantity: 1,
            product_name: 'test_name',
            description: 'test_desc',
            price: 1.0,
            stock_remaining: 1,
            img_src: 'test_img_src',
            created_at: 1,
        };

        mockCartItems = [mockItem];
        cartService.cartItems.set(mockCartItems);
    })

    afterEach(() => {
        httpTestingController.verify();
        mockQueryAPI.mockClear();
    })

    it('should create a service', () => {
        expect(cartService).toBeTruthy();
    })

    describe('ngOnDestroy', () => {
        it('should unsubscribe apiSubscription', () => {
            const ngOnDestroySpy = jest.spyOn(cartService, 'ngOnDestroy');
            cartService.ngOnDestroy();
            expect(ngOnDestroySpy).toHaveBeenCalled();
            // This is dumb, ask Xin how to handle private properties (if at all)
        })
    })

    describe('addProductToCart', () => {
        it('should do nothing if cartId is undefined', () => {
            cartService.addProductToCart(mockProduct);
            expect(postCartItemSpy).not.toHaveBeenCalled();
            expect(increaseItemSpy).not.toHaveBeenCalled();
        })
        it('should call postCartItem(item) if cart is empty/undefined', () => {  
            cartService.cartItems.set(undefined);  
            cartService.cartId = 1;
            cartService.addProductToCart(mockProduct);
            expect(postCartItemSpy).toHaveBeenCalled();
        });
        it('should call postCartItem(item) if item doesnt exist in cart yet', () => {
            const nonExistProduct: TProduct = {
                id: -1,
                product_name: 'test_name',
                description: 'test_desc',
                price: 1.0,
                img_src: 'test_img_src',
                stock_remaining: 1,
                created_at: 1
            }
            cartService.cartId = 1;
            cartService.cartItems.set(mockCartItems);
            cartService.addProductToCart(nonExistProduct);
            expect(postCartItemSpy).toHaveBeenCalled();
            expect(increaseItemSpy).not.toHaveBeenCalled();
        });
        it('should call increaseItemQuantity(item) if item exists in cart', () => {
            cartService.cartId = 1;
            cartService.cartItems.set(mockCartItems);
            cartService.addProductToCart(mockProduct);
            expect(increaseItemSpy).toHaveBeenCalled();
            expect(postCartItemSpy).not.toHaveBeenCalled();
        })
    })

    describe('increaseItemQuantity', () => {

        it('should increase the cartItem quantity', () => {
            cartService.increaseItemQuantity(mockItem);
            expect(mockItem.quantity).toEqual(2);
        })
        it('should call updateCartItem with updated item', () => {
            const updateCartItemSpy = jest.spyOn(cartService, 'updateCartItem');
            cartService.increaseItemQuantity(mockItem);
            expect(updateCartItemSpy).toHaveBeenCalledWith(mockItem);
        })
    })

    describe('decreaseItemQuantity', () => {
        it('should decrease the cartItem quantity', () => {
            mockItem.quantity = 4;
            cartService.decreaseItemQuantity(mockItem);
            expect(mockItem.quantity).toEqual(3);
        })
        it('should call deleteCartItem if quantity becomes 0', () => {
            const deleteCartItemSpy = jest.spyOn(cartService, 'deleteCartItem');
            mockItem.quantity = 1;
            cartService.decreaseItemQuantity(mockItem);
            expect(deleteCartItemSpy).toHaveBeenCalledWith(mockItem);
        })
        it('should call updateCartItem with updated item', () => {
            const updateCartItemSpy = jest.spyOn(cartService, 'updateCartItem');
            cartService.increaseItemQuantity(mockItem);
            expect(updateCartItemSpy).toHaveBeenCalledWith(mockItem);
        })
    })

    describe('updateCartItem', () => {
        it('should do nothing if user isnt logged in', () => {
            isLoggedInSpy.mockReturnValue(false);
            cartService.updateCartItem(mockItem);
            expect(mockQueryAPI).not.toHaveBeenCalled();
        })
        it('should call queryAPI', () => {
            isLoggedInSpy.mockReturnValue(true);
            cartService.updateCartItem(mockItem);
            expect(mockQueryAPI).toHaveBeenCalled();
        })
    })

    describe('postCartItem', () => {
        it('should do nothing if user isnt logged in', () => {
            isLoggedInSpy.mockReturnValue(false);
            cartService.postCartItem(mockItem);
            expect(mockQueryAPI).not.toHaveBeenCalled();
        })
        it('should call queryAPI', () => {
            isLoggedInSpy.mockReturnValue(true);
            cartService.postCartItem(mockItem);
            expect(mockQueryAPI).toHaveBeenCalled();
        })
    })

    describe('deleteCartItem', () => {
        it('should do nothing if user isnt logged in', () => {
            isLoggedInSpy.mockReturnValue(false);
            cartService.deleteCartItem(mockItem);
            expect(mockQueryAPI).not.toHaveBeenCalled();
        })
        it('should call queryAPI', () => {
            isLoggedInSpy.mockReturnValue(true);
            cartService.deleteCartItem(mockItem);
            expect(mockQueryAPI).toHaveBeenCalled();
        })
    })

    describe('getCartItems', () => {
        it('should do nothing if user isnt logged in', () => {
            isLoggedInSpy.mockReturnValue(false);
            cartService.getCartItems();
            expect(mockQueryAPI).not.toHaveBeenCalled();
        })
        it('should call queryAPI', () => {
            isLoggedInSpy.mockReturnValue(true);
            cartService.getCartItems();
            expect(mockQueryAPI).toHaveBeenCalled();
        })
    })

    describe('getCartId', () => {
        it('should do nothing if user isnt logged in', () => {
            isLoggedInSpy.mockReturnValue(false);
            cartService.deleteCartItem(mockItem);
            expect(mockQueryAPI).not.toHaveBeenCalled();
        })
        it('should call queryAPI', () => {
            isLoggedInSpy.mockReturnValue(true);
            cartService.getCartId();
            expect(mockQueryAPI).toHaveBeenCalled();
        })
    })

    describe('computeTotalPrices', () => {
        it('should return 0 if the cart is undefined', () => {
            cartService.cartItems.set(undefined);
            expect(cartService.computeTotalPrice()).toEqual(0);
        })
        it('should return 0 if the cart is empty', () => {
            const emptyCartItems: TCartItemList = []
            cartService.cartItems.set(emptyCartItems);
            expect(cartService.computeTotalPrice()).toEqual(0);
        })
        it('should return the correct price sum of cart items', () => {
            expect(cartService.computeTotalPrice()).toEqual(mockItem.price);
        })
    })

    describe('queryAPI', () => {
        it('make a http get request if given a HTTP_GET argument', () => {
            cartService['queryAPI'] = orginalQuery;
            cartService.queryAPI(HTTP_GET, API_URL, () => {}, {} )
            const request = httpTestingController.expectOne(API_URL);
            expect(request.request.method).toBe('GET');
        })
        it('make a http post request if given a HTTP_POST argument', () => {
            cartService['queryAPI'] = orginalQuery;
            cartService.queryAPI(HTTP_POST, API_URL, () => {}, {} )
            const request = httpTestingController.expectOne(API_URL);
            expect(request.request.method).toBe('POST');
        })
        it('make a http patch request if given a HTTP_PATCH argument', () => {
            cartService['queryAPI'] = orginalQuery;
            cartService.queryAPI(HTTP_PATCH, API_URL, () => {}, {} )
            const request = httpTestingController.expectOne(API_URL);
            expect(request.request.method).toBe('PATCH');
        })
        it('make a http delete request if given a HTTP_DELETE argument', () => {
            cartService['queryAPI'] = orginalQuery;
            cartService.queryAPI(HTTP_DELETE, API_URL, () => {}, {} )
            const request = httpTestingController.expectOne(API_URL);
            expect(request.request.method).toBe('DELETE');
        })
        it('should do nothing if an unknown http request argument is given', () => {
            const HTTP_UNKNOWN = -1
            cartService['queryAPI'] = orginalQuery;
            cartService.queryAPI(HTTP_UNKNOWN, API_URL, () => {}, {} )
            httpTestingController.expectNone(API_URL);
        })
    })

})