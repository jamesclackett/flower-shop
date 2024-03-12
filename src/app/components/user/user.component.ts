import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TUser, UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
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

    onClickDeleteAddress(addressIndex: number) {
        this.deleteAddress(addressIndex);
    }

    onClickSaveAddress(addressIndex: number, address: string) {
        this.editAddress(addressIndex, address);
    }

    onClickAddNewAddress(address: string) {
        this.addNewAddress(address);
        
    }

    editAddress(addressIndex: number, address: string) {
        if (this.user){
            this.userService.updateUserAddress(this.user.id, addressIndex, address);
        }
    }

    addNewAddress(address: string) {
        if (this.user) {
            this.userService.addUserAddress(this.user.id, address);
        }
    }

    deleteAddress(addressIndex: number) {
        if (this.user) {
            this.userService.removeUserAddress(this.user.id, addressIndex)
        }
    }
}
