import { Component, OnInit, WritableSignal, inject } from '@angular/core';
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
    activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    user: WritableSignal<TUser | undefined> = this.userService.user;

    onClickDeleteAddress(addressIndex: number) : void{
        this.deleteAddress(addressIndex);
    }

    onClickEditAddress(addressIndex: number, address: string): void {
        this.editAddress(addressIndex, address);
    }

    onClickAddAddress(address: string): void {
        this.addAddress(address);
    }

    editAddress(addressIndex: number, address: string): void {
        this.userService.editUserAddress(addressIndex, address);
    }

    addAddress(address: string): void {
        this.userService.addUserAddress(address);
    }

    deleteAddress(addressIndex: number): void {
        this.userService.deleteUserAddress(addressIndex);
    }

    onClickLogout(): void {
        const success = this.userService.logoutUser();
        if (!success) console.log("error logging out!");
    }
}
