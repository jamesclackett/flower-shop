import { Component, OnInit, inject} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.sass'
})
export class UserLoginComponent implements OnInit {
    isLoggedIn: boolean = true;
    userId: string = "1" // TEMPORARY!!!
    router: Router = inject(Router);

    ngOnInit() {
        if (this.isLoggedIn) {
            this.router.navigate(['/user/', this.userId]);
        }
        else {
            this.router.navigate(['/user-registration']);
        }
    }
    
}
