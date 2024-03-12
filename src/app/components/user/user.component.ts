import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TUser, UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
    userService: UserService = inject(UserService);
    activatedRoute = inject(ActivatedRoute);
    user: TUser | undefined;

    ngOnInit(): void {
        const userId: string | null = this.activatedRoute.snapshot.paramMap.get('id');
        if (userId) {
            this.user = this.userService.getUserById(userId);
        } 
    }

    onClickEditAddress(addressIndex: number, address: string) {
        this.editAddress(addressIndex, address);
    }

    onClickAddNewAddress(address: string) {
        this.addNewAddress(address);
    }

    editAddress(addressIndex: number, address: string) {

    }

    addNewAddress(address: string) {

    }
}
