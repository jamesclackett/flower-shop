import { Injectable } from '@angular/core';

export type TUser = {
    id: string;
    username: string;
    email: string;
    addressList: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
    userList: TUser[] = [
        {   
            id: "1",
            username: "jamesclackett",
            email: "james@gmail.com",
            addressList: ["123 fakestreet, Dublin"]
        },
        {   
            id: "2",
            username: "johnnyrotten",
            email: "johnny@gmail.com",
            addressList: ["292 faketown, London", "9090 Upstreet"]
        },
        {   
            id: "3",
            username: "lolalee",
            email: "lola@ymail.com",
            addressList: ["90 uptown, New York", "TestAddress, TestTown"]
        },
    ]

    getUserById(id: string): TUser | undefined  {
        return this.userList.find((u)=> u.id ===id);
    }
    
    getUsers() : TUser[] {
        return this.userList;
    }

    updateUserAddress(id: string, addressIndex: number, address: string) {
        this.userList = this.userList.map((user) =>  {
            if (user.id === id) {
                if (user.addressList.length > addressIndex){
                    user.addressList[addressIndex] = address;
                } else {
                    user.addressList.push(address);
                }
            }
            return user;
        })
    }
    
    removeUserAddress(id: String, addressIndex: number) {
        this.userList = this.userList.map((user) =>  {
            if (user.id === id) {
                if (user.addressList.length > addressIndex){
                    user.addressList.splice(addressIndex, 1);
                } 
            }
            return user;
        })
    }
}
