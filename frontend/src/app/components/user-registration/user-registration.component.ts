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
    userRegistrationService = inject(UserRegistrationService);
    userForm: TUserRegisterForm = {username: '', password: '', email: '', address: ''};

    onClickSubmit() {
        this.registerUser(this.userForm);

        // if (success) {
        //     this.router.navigate(['user-login']);
        // }
        // else {
        //     console.log("issue registering. try again.")
        // }
    }

    registerUser(form: TUserRegisterForm) {
        this.userRegistrationService.registerUser(form);
    }
}
