import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductDetailComponent } from "./product-detail.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { signal } from "@angular/core";
import { TProduct } from "../../services/product/product.service";
import { TUser, UserService } from "../../services/user/user.service";
import { CartService } from "../../services/cart/cart.service";

describe('ProductDetailComponent', () => {
    let userService: UserService;
    let cartService: CartService;
    let pdComponent: ProductDetailComponent;
    let fixture: ComponentFixture<ProductDetailComponent>;
    let compiled: HTMLElement;

    const mockProduct: TProduct = {
        uuid: '1',
        product_name: 'test_name',
        description: 'test_desc',
        price: 1.0,
        img_src: 'test_img_src',
        stock_remaining: 1,
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProductDetailComponent, HttpClientTestingModule],
            providers: [UserService, CartService]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductDetailComponent);
        userService = TestBed.inject(UserService);
        cartService = TestBed.inject(CartService);
        pdComponent = fixture.componentInstance;
        compiled = fixture.nativeElement as HTMLElement;
        fixture.detectChanges();
    })

    it('should create component', () => {
        expect(pdComponent).toBeTruthy();
    })

    it('if product defined show product detail content div', () => {
        pdComponent.product = signal<TProduct | undefined>(mockProduct);
        fixture.detectChanges();
        const contentElem = compiled.querySelector('div.product-detail-content');
        expect(contentElem).toBeTruthy();
    })

    it('if product not defined show product detail empty div', () => {
        pdComponent.product = signal<TProduct | undefined>(undefined);
        fixture.detectChanges();
        const emptyElem = compiled.querySelector('div.product-detail-empty');
        expect(emptyElem).toBeTruthy();
    })
    it('should call onClickAddToCart if button clicked', () => {
        pdComponent.product = signal<TProduct | undefined>(mockProduct);
        fixture.detectChanges();
        const buttonElem = compiled.querySelector('button.product-detail-add');
        expect(buttonElem).toBeTruthy();

        const onClickAddToCartSpy = jest.spyOn(pdComponent, 'onClickAddToCart');
        buttonElem?.dispatchEvent(new Event('click'));
        expect(onClickAddToCartSpy).toHaveBeenCalled()
    })
    describe('onClickAddToCart', () => {
        it('should call addToCart if user is logged in', () => {
            const addProductToCartSpy = jest.spyOn(cartService, 'addProductToCart')

            const mockUser: TUser = {
                uuid: '1',
                username: 'test',
                password: 'test',
                email: 'testmail',
                address_list: []
            }

            const mockProduct: TProduct = {
                uuid: '1',
                product_name: 'test_name',
                description: 'test_desc',
                price: 1.0,
                img_src: 'test_img_src',
                stock_remaining: 1
            }

            userService.user.set(mockUser);
            pdComponent.product = signal<TProduct | undefined>(mockProduct);
            pdComponent.onClickAddToCart()
            expect(addProductToCartSpy).toHaveBeenCalled();
            
        })
        it('should not call call addToCart if user isnt logged in', () => {
            const addProductToCartSpy = jest.spyOn(cartService, 'addProductToCart')
            userService.user.set(undefined);
            pdComponent.product = signal<TProduct | undefined>(undefined);
            pdComponent.onClickAddToCart()
            expect(addProductToCartSpy).not.toHaveBeenCalled();
        })
    })
    

})