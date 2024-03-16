import { Component, OnDestroy, OnInit, inject} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})

export class UserLoginComponent implements OnInit, OnDestroy {
    router: Router = inject(Router);
    userService = inject(UserService);
    userForm = {username: '', password: ''};
    loginSubscription = new Subscription;

    ngOnInit() {
        this.loginSubscription = this.userService.user$.subscribe(
            () => {if (this.userService.isLoggedIn()) {
                this.router.navigate(['/user/', this.userService.getUserId()]);
            }}
        )
        if (this.userService.isLoggedIn()) {
            this.router.navigate(['/user/', this.userService.getUserId()]);
        }
    }

    onClickLogin() {
        this.login();   
    }

    login() {
        const {username, password} = this.userForm;
        this.userService.loginUser(username, password);
        console.log("logging in...")
    }

    ngOnDestroy(): void {
        this.loginSubscription.unsubscribe();
    }

   
}
