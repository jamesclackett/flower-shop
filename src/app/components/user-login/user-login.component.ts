import { Component, OnInit, inject} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss'
})

export class UserLoginComponent implements OnInit{
    isLoggedIn: boolean = false;
    userName: string | undefined;
    userId: string | undefined;
    userPass: string | undefined;
    router: Router = inject(Router);
    userService = inject(UserService);

    ngOnInit() {
        if (this.isLoggedIn && this.userId) {
            this.router.navigate(['/user/', this.userId]);
        }
    }

    onClickLogin() {
        if (this.login() && this.userId) {
            this.isLoggedIn = true;
            this.router.navigate(['/user/', this.userId]);
        }
    }

    login() : boolean {
        if (this.userPass && this.userName) {
            const valid = this.userService.validatePassword(this.userName, this.userPass);
            if (valid) {
                const user = this.userService.getUserByUsername(this.userName);
                this.userId = user?.id;
                return true;
            } else {
                console.log("passwords do not match");
                return false;
            }
        }
        return false
    }
}
