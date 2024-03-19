import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TUserRegisterForm, UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent {
    router: Router = inject(Router);
    userService: UserService = inject(UserService);
    userForm: TUserRegisterForm = {username: '', password: '', email: '', address: ''};

    onClickSubmit(): void {
        this.registerUser(this.userForm);
    }

    registerUser(form: TUserRegisterForm): void {
        this.userService.registerUser(form);
    }
}
