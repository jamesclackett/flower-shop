import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, WritableSignal, inject, numberAttribute, signal } from '@angular/core';
import { API_URL_USER } from '../../shared/constants';
import { Observable, Subscription, subscribeOn, switchMap, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

export type TUser = {
    id: number;
    username: string;
    password: string;
    email: string;
    address_list: string[];
    created_at: number;
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
    user$: Observable<TUser | undefined> = toObservable(this.user);
    apiSubscription: Subscription = new Subscription;

    getUserId(): number | undefined{
        let user = this.user();
        return user ? user.id : undefined;
    }

    isLoggedIn() : boolean {
        let user = this.user()
        return user ? true: false;
    }

    loginUser(username: string, password: string): void {
        this.apiSubscription = this.findUser(username).pipe(take(1)).subscribe(
            (user) => {
                if (user && user.password === password) {
                    this.user.set(user);
                }
            }
        )
    }

    logoutUser(): boolean {
        this.user.set(undefined);
        let user = this.user();
        return user === undefined ? true : false;
    }

    findUser(username: string): Observable<TUser> {
        return this.httpClient.get<TUser>(API_URL_USER + username);
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
        const URL = `${API_URL_USER}${user.id}`
            this.apiSubscription = this.httpClient.patch(URL, {"user" : user}).pipe(take(1)).subscribe(
                () => {this.user.set(user)}
            )
    }

    ngOnDestroy() : void {
        this.apiSubscription.unsubscribe();
    }

    registerUser(form: TUserRegisterForm): void {

        const user: TUser = {
            id: -1, 
            username: form.username, 
            password: form.password,
            email: form.email,
            address_list: [form.address] ,
            created_at: Date.now()  / 1000
        }
        this.httpClient.post(API_URL_USER, {"user" : user}).pipe(take(1)).subscribe(
            (res) => { this.router.navigate(['/user-login'])},
            (err) => {console.log(err)}
        );
    }
}
