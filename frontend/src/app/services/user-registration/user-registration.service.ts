import { Injectable, inject } from '@angular/core';
import { UserService } from '../user/user.service';
import { TUser } from '../user/user.service';
import { HttpClient } from '@angular/common/http';
import { API_URL_USER } from '../../shared/constants';
import { take } from 'rxjs';
import { Router } from '@angular/router';

export type TUserRegisterForm = {
    username: string; 
    password: string;
    email: string;
    address: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
    userService: UserService = inject(UserService);
    httpClient: HttpClient = inject(HttpClient);
    router: Router = inject(Router);

    registerUser(form: TUserRegisterForm) {

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
