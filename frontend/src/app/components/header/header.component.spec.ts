import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { RouterTestingModule } from "@angular/router/testing";

describe('HeaderComponent', () => {
    let headerComponent: HeaderComponent
    let fixture: ComponentFixture<HeaderComponent>
    let compiled: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HeaderComponent, RouterTestingModule]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        headerComponent = fixture.componentInstance;
        compiled = fixture.nativeElement as HTMLElement;
        fixture.detectChanges();
    })

    it('should create component', () => {
        expect(headerComponent).toBeTruthy();
    })

    it('should contain a header-content div', () => {
        const contentElem = compiled.querySelector('div.header-content');
        expect(contentElem).toBeTruthy();
    })
    it('should contain a header-title link', () => {
        const titleElem = compiled.querySelector('a.header-title');
        expect(titleElem).toBeTruthy();
    })
    it('should contain a header-nav div', () => {
        const navElem = compiled.querySelector('div.header-nav');
        expect(navElem).toBeTruthy();

        const homeElem = compiled.querySelector('a.header-nav-home');
        expect(homeElem).toBeTruthy();

        const aboutElem = compiled.querySelector('div.header-nav-about');
        expect(aboutElem).toBeTruthy();

        const contactElem = compiled.querySelector('div.header-nav-contact');
        expect(contactElem).toBeTruthy();

    })
    it('should contain a header-user div', () => {
        const userElem = compiled.querySelector('div.header-user');
        expect(userElem).toBeTruthy();

        const cartElem = compiled.querySelector('a.header-user-cart');
        expect(cartElem).toBeTruthy();

        const profileElem = compiled.querySelector('a.header-user-profile');
        expect(profileElem).toBeTruthy();
    })

})