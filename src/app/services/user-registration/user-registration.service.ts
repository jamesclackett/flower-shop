import { Injectable, inject } from '@angular/core';
import { UserService } from '../user/user.service';
import { TUser } from '../user/user.service';

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

    registerUser(form: TUserRegisterForm) {
        console.log("gonna register now!");
        const newUserId = this.userService.generateId();

        const user: TUser = {
            id: newUserId, 
            username: form.username, 
            password: form.password,
            email: form.email,
            addressList: [form.address]    
        }
        
        this.userService.addNewUser(user);
    }
}
