import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TUser, UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent {
    userService: UserService = inject(UserService);
    activatedRoute = inject(ActivatedRoute);
    user = this.userService.user;

    onClickDeleteAddress(addressIndex: number) {
        this.deleteAddress(addressIndex);
    }

    onClickEditAddress(addressIndex: number, address: string) {
        this.editAddress(addressIndex, address);
    }

    onClickAddAddress(address: string) {
        this.addAddress(address);
    }

    editAddress(addressIndex: number, address: string) {
        this.userService.editUserAddress(addressIndex, address);
    }

    addAddress(address: string) {
        this.userService.addUserAddress(address);
    }

    deleteAddress(addressIndex: number) {
        this.userService.deleteUserAddress(addressIndex);
    }

    onClickLogout() {
        this.userService.logoutUser();
    }
}
