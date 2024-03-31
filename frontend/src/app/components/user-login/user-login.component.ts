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
        this.loginSubscription = this.userService.isLoggedIn().subscribe((loggedIn) => {
            if (loggedIn) {
                this.router.navigate(['/user/']);
            }
        })
    }

    onClickLogin(): void {
        this.login();   
    }

    login(): void {
        const {username, password} = this.userForm;
        
        const didLogin$ = this.userService.loginUser(username, password);
        this.loginSubscription = didLogin$.subscribe({
            next: (success) => {
                if (success) {
                    this.router.navigate(['/user/']);
                } else {
                    console.log("user was not logged in");
                }
            },
            error: (error) => {
                console.log("error logging in: ", error);
            }
        })
    }

    ngOnDestroy(): void {
        this.loginSubscription.unsubscribe();
    }

   
}
