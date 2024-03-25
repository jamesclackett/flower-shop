import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, WritableSignal, inject, signal } from '@angular/core';
import { API_URL_USER } from '../../shared/constants';
import { Observable, Subscription} from 'rxjs';
import { Router } from '@angular/router';

export type TUser = {
    uuid: string;
    username: string;
    password: string;
    email: string;
    address_list: string[];
}

export type TUserRegisterForm = {
    username: string; 
    password: string;
    email: string;
    address: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{
    private httpClient: HttpClient = inject(HttpClient);
    router: Router = inject(Router)
    user: WritableSignal<TUser | undefined> = signal<TUser | undefined> (undefined);
    apiSubscription: Subscription = new Subscription;

    ngOnDestroy() : void {
        this.apiSubscription.unsubscribe();
    }

    getUserUUID(): string | undefined{
        return this.user() ? this.user()?.uuid : undefined;
    }

    isLoggedIn() : boolean {
        return this.user() ? true: false;
    }

    loginUser(username: string, password: string): Observable<boolean> {
        const userPayload = {
            username: username,
            password: password
        }

        return new Observable<boolean>(observer => {
            this.apiSubscription = 
                this.httpClient.post<{user: TUser | undefined; jwtToken: string}>(API_URL_USER + 'login', {"user": userPayload}).subscribe({
                next: (res) => {
                    if (res.user) {
                        this.user.set(res.user);
                        localStorage.setItem('jwtToken', res.jwtToken);
                        observer.next(true);
                    } else {
                        this.user.set(undefined);
                        observer.next(false);
                    }
                },
                error: (error: any) => {
                    this.user.set(undefined);
                    observer.error(error)
                },
                complete: () => {observer.complete()}
            });
        })
        
    }

    logoutUser(): boolean {
        this.user.set(undefined);
        localStorage.removeItem('jwtToken');
            if (localStorage.getItem('jwtToken')) return false;
            if (!this.user() == undefined) return false;
        return true;
    }

    editUserAddress(addressIndex: number, address: string): void {
        let user = this.user();
        if (user) {
            user.address_list[addressIndex] = address;
            this.updateUser(user);
        }   
    }
    
    addUserAddress(address: string): void {
        let user = this.user();
        if (user) {
            user.address_list.push(address);
            this.updateUser(user);
        }
    }

    deleteUserAddress(addressIndex: number): void {
        let user = this.user();
        if (user) {
            if (user.address_list.length > 1) {
                user.address_list.splice(addressIndex, 1);
                this.updateUser(user);
            } else {
                console.log("cannot remove users only address");
            }
        }
    }

    updateUser(user: TUser): void {
        const URL = `${API_URL_USER}${user.uuid}`
            this.apiSubscription = this.httpClient.patch(URL, {"user" : user}).subscribe(
                () => {this.user.set(user)}
            )
    }

    registerUser(form: TUserRegisterForm): void {

        const user: TUser = {
            uuid: '', 
            username: form.username, 
            password: form.password,
            email: form.email,
            address_list: [form.address]
        }
        this.apiSubscription = this.httpClient.post(API_URL_USER + 'register', {"user" : user}).subscribe({
            next: () => { this.router.navigate(['/user/login']) },
            error: (error) => { console.log(error) }
        })
    }

    
}
