import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})

export class UserLoginComponent implements OnInit, OnDestroy {
    router: Router = inject(Router);
    userService: UserService = inject(UserService);
    userForm = {username: '', password: ''};
    loginSubscription: Subscription = new Subscription;

    ngOnInit(): void {
        this.loginSubscription = this.userService.user$.subscribe(
            () => {if (this.userService.isLoggedIn()) {
                this.router.navigate(['/user/', this.userService.getUserId()]);
            }}
        )
        if (this.userService.isLoggedIn()) {
            this.router.navigate(['/user/', this.userService.getUserId()]);
        }
    }

    onClickLogin(): void {
        this.login();   
    }

    login(): void {
        const {username, password} = this.userForm;
        this.userService.loginUser(username, password);
        console.log("logging in...")
    }

    ngOnDestroy(): void {
        this.loginSubscription.unsubscribe();
    }

   
}
