import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { API_LOGIN, API_REGISTER, AUTH_API, USER_API } from '../../shared/constants';
import { Observable, of} from 'rxjs';
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
export class UserService {
    private httpClient: HttpClient = inject(HttpClient);
    router: Router = inject(Router)
    user: WritableSignal<TUser | undefined> = signal<TUser | undefined> (undefined);

    constructor() {
        this.isLoggedIn().subscribe((isLoggedIn) => {
            if (isLoggedIn) {
                this.getUser().subscribe();
            } else {
                this.router.navigate(['user/login']);
            }
        })
    }

    getUserUUID(): string | undefined{
        return this.user() ? this.user()?.uuid : undefined;
    }

    getUser(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.httpClient.get<TUser>(USER_API).subscribe({
                next: (user) => {
                    if (user) {
                        this.user.set(user);
                        observer.next(true);
                    } else {
                        this.user.set(undefined);
                        observer.next(false);  
                    }
                },
                error: (error) => {
                    console.log(error);
                    observer.next(error);
                }
            }) 
        })
    }

    isLoggedIn(): Observable<boolean> {
        //is there a token and is it still valid:
        const token = localStorage.getItem('jwtToken');
        if (!token) return of(false);
        return this.isTokenValid();
    }

    isTokenValid(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.httpClient.get<{isValid: boolean}>(AUTH_API + 'token/verify').subscribe({
                next: (res) => {
                    observer.next(true);
                },
                error: (error) => {
                    observer.next(false)
                }
            })
        })      
    }

    // refreshToken(): Observable<boolean> {
    //     return new Observable<boolean>((observer) => {
    //         this.httpClient.get<{jwtToken: string}>(AUTH_API + 'token/refresh').subscribe({
    //             next: (res) => {
    //                 if (res.jwtToken) {
    //                     localStorage.setItem('jwtToken', res.jwtToken);
    //                     observer.next(true);
    //                 } else observer.next(false);  
    //             },
    //             error: (error) => {
    //                 console.log(error)
    //                 observer.error(error);
    //             }
    //         })
    //     });
    // }

    loginUser(username: string, password: string): Observable<boolean> {
        const userPayload = {
            username: username,
            password: password
        }
        // Too much nesting?
        return new Observable<boolean>(observer => {
            // request authentication token:
            this.httpClient.post<{jwtToken: string}>(API_LOGIN, {"user": userPayload}).subscribe({
                next: (response) => {
                    if (response.jwtToken) {
                        localStorage.setItem('jwtToken', response.jwtToken);
                        // get user object now that authorization is complete
                        this.getUser().subscribe({
                            next: (success) => {
                                observer.next(success);
                            },
                            error: (error) => observer.error(error)
                        });
                    } else {
                        observer.next(false);
                    }
                },
                error: (error: any) => {
                    observer.error(error);
                }
            });
        })
        
    }

    logoutUser(): boolean {
        this.user.set(undefined);
        localStorage.removeItem('jwtToken');
        sessionStorage.removeItem('jwtRefreshToken');
        // checks:
        if (localStorage.getItem('jwtToken')) return false;
        if (sessionStorage.getItem('jwtRefreshToken')) return false;
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
        this.httpClient.patch<TUser>(USER_API, {"user" : user}).subscribe({
            next: (user) => { this.user.set(user) },
            error: (error) => { console.log(error) }
        });
    }

    registerUser(form: TUserRegisterForm): void {
        const user: TUser = {
            uuid: '', 
            username: form.username, 
            password: form.password,
            email: form.email,
            address_list: [form.address]
        }
        this.httpClient.post(API_REGISTER, {"user" : user}).subscribe({
            next: () => { this.router.navigate(['/user/login']) },
            error: (error) => { console.log(error) }
        });
    }
    
}
