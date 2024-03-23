import { TProduct, TProductList } from "../../services/product/product.service";
import { ProductListComponent } from "./product-list.component"
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule} from "@angular/common/http/testing";
import { signal } from "@angular/core";
import { RouterTestingModule} from "@angular/router/testing"

describe('ProductListComponent', () => {
    let plComponent: ProductListComponent
    let fixture: ComponentFixture<ProductListComponent>;

    const mockProduct: TProduct = {
        uuid: '1',
        product_name: 'test_name',
        description: 'test_desc',
        price: 1.0,
        img_src: 'test_img_src',
        stock_remaining: 1
    }

    const mockProductList: TProductList = [mockProduct];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProductListComponent, HttpClientTestingModule, RouterTestingModule]
        }).compileComponents()

        fixture = TestBed.createComponent(ProductListComponent);
        plComponent = fixture.componentInstance;
        fixture.detectChanges();
    })

    it('should create component', () => {
       expect(plComponent).toBeTruthy(); 
    })

    it('should show a title of "Current Product List:"', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const titleElement = compiled.querySelector('div.product-list-title');
        expect(titleElement).toBeTruthy();
        expect(titleElement?.textContent).toContain('Current Product List:');
    })
    it('if product list is undefined/empty show "Nothing found!', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const contentElement = compiled.querySelector('div.product-list-content');
        expect(contentElement).toBeTruthy();
        expect(contentElement?.textContent).toContain('Nothing found!')
        const itemElement = compiled.querySelector('div.product-list-item');
        expect(itemElement).not.toBeTruthy();
    })
    it('if product list, show list of products', () => {
        plComponent.productList = signal<TProductList | undefined>(mockProductList);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const itemElement = compiled.querySelector('div.product-list-item');
        expect(itemElement).toBeTruthy();
    })
})