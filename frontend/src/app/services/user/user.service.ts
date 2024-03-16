import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject, numberAttribute, signal } from '@angular/core';
import { API_URL_USER } from '../../shared/constants';
import { Observable, Subscription, subscribeOn, switchMap, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export type TUser = {
    id: number;
    username: string;
    password: string;
    email: string;
    address_list: string[];
    created_at: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{
    private httpClient = inject(HttpClient);
    user = signal<TUser | undefined> (undefined);
    user$ = toObservable(this.user);
    apiSubscription = new Subscription;

    getUserId(): number | undefined{
        let user = this.user();
        return user ? user.id : undefined;
    }

    isLoggedIn() : boolean {
        let user = this.user()
        return user ? true: false;
    }

    loginUser(username: string, password: string) {
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

    editUserAddress(addressIndex: number, address: string) {
        let user = this.user();
        if (user) {
            user.address_list[addressIndex] = address;
            this.updateUser(user);
        }   
    }
    
    addUserAddress(address: string) {
        let user = this.user();
        if (user) {
            user.address_list.push(address);
            this.updateUser(user);
        }
    }

    deleteUserAddress(addressIndex: number) {
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

    updateUser(user: TUser) {
        const URL = `${API_URL_USER}${user.id}`
            this.apiSubscription = this.httpClient.patch(URL, {"user" : user}).pipe(take(1)).subscribe(
                () => {this.user.set(user)}
            )
    }

    ngOnDestroy() : void {
        this.apiSubscription.unsubscribe();
    }
}
