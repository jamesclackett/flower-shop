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

    describe('setProductSignal', () => {
        it('should make http call for search', () => {
            productService.setProductSignal('test_uuid')
            httpTestingController.expectOne(API_URL_PRODUCT + 'test_uuid');
        })
    })
})