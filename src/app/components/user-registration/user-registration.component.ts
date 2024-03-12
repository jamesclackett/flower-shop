import { Component, inject } from '@angular/core';
import { TUserRegisterForm, UserRegistrationService } from '../../services/user-registration/user-registration.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent {
    router: Router = inject(Router);
    userRegistrationSerive: UserRegistrationService = inject(UserRegistrationService);
    userForm: TUserRegisterForm = {username: "", password: "", email: "", address: ""};

    onClickSubmit() {
        console.log("form submitted:", this.userForm);
        this.registerUser(this.userForm);
        this.router.navigate(['user-login']);
    }

    registerUser(form: TUserRegisterForm) {
        this.userRegistrationSerive.registerUser(form);
    }
}
