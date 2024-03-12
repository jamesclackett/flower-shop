import { Injectable } from '@angular/core';

export type TUser = {
    id: string;
    username: string;
    password: string;
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
            password: "123",
            email: "james@gmail.com",
            addressList: ["123 fakestreet, Dublin"]
        },
        {   
            id: "2",
            username: "johnnyrotten",
            password: "whoneedsapassword",
            email: "johnny@gmail.com",
            addressList: ["292 faketown, London", "9090 Upstreet"]
        },
        {   
            id: "3",
            username: "lolalee",
            password: "lala1234",
            email: "lola@ymail.com",
            addressList: ["90 uptown, New York", "TestAddress, TestTown"]
        },
    ]

    getUserById(id: string): TUser | undefined  {
        return this.userList.find((u)=> u.id ===id);
    }

    getUserByUsername(username: string): TUser | undefined {
        return this.userList.find((u)=> u.username === username);
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
    
    addUserAddress(id: string, address: string) {
        this.userList = this.userList.map((user) => {
            if (user.id === id) {
                user.addressList.push(address);
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

    addNewUser(user: TUser) {
        this.userList.push(user);
        console.log("added a new user. List of all users:")
        for (const u of this.userList) {
            console.log("username:", u.username, "id:", u.id);
        }
    }

    generateId() : string {
        return (this.userList.length + 1).toString();
    }

    validatePassword(username: string, password: string): boolean {
        const user = this.userList.find((user)=> user.username === username);
        if (user && user.password === password) return true;
        return false;
    }
}
