import { ProductService } from './product.service'
import { TestBed } from '@angular/core/testing'
 import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { API_URL_PRODUCT } from '../../shared/constants';

describe('ProductService', () => {
    let productService: ProductService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ProductService]
        })
        productService = TestBed.inject(ProductService);
        httpTestingController = TestBed.inject(HttpTestingController);
    })

    afterEach(() => {
        //httpTestingController.verify();
    })

    it('should create a service', () => {
        expect(productService).toBeTruthy();
    })

    describe('setProductId', () => {
        it('should set product id with the provided id', () => {
            const id = 1;
            productService.setProductId(id);
            //httpTestingController.expectOne(API_URL_PRODUCT + id);
            expect(productService.productId()).toBe(id);
        })
    })
})