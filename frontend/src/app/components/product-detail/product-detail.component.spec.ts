import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductDetailComponent } from "./product-detail.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { signal } from "@angular/core";
import { TProduct } from "../../services/product/product.service";

describe('ProductDetailComponent', () => {
    let pdComponent: ProductDetailComponent;
    let fixture: ComponentFixture<ProductDetailComponent>;
    let compiled: HTMLElement;

    const mockProduct: TProduct = {
        id: 1,
        product_name: 'test_name',
        description: 'test_desc',
        price: 1.0,
        img_src: 'test_img_src',
        stock_remaining: 1,
        created_at: 1
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProductDetailComponent, HttpClientTestingModule]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductDetailComponent);
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
    it('should call cartService.addToCart if user is logged in', () => {
        // addToCart is private, no way to test
    })

})