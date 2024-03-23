import { TestBed } from '@angular/core/testing'
import { TUser, TUserRegisterForm, UserService } from './user.service'
import { API_URL_USER } from '../../shared/constants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subscription, of } from 'rxjs';

describe('UserService', () => {
    let userService: UserService;
    let httpTestingController: HttpTestingController;
    let mockUser: TUser;
    let updateUserSpy: jest.SpyInstance<void, [user: TUser], any>
    let subscription = new Subscription

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService]
        })
        userService = TestBed.inject(UserService);
        httpTestingController = TestBed.inject(HttpTestingController)
        updateUserSpy = jest.spyOn(userService, 'updateUser');
        userService.user.set(undefined);

        mockUser = {
            uuid: '1',
            username: 'test_user',
            password: 'test_pass',
            email: '',
            address_list: ['test1', 'test2']
        }
    });

    afterEach(() => {
        httpTestingController.verify();
        subscription.unsubscribe();
      });

    it('creates a service', () => {
        expect(userService).toBeTruthy();
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe apiSubscription', () => {
            userService.ngOnDestroy();
            expect(userService.apiSubscription.closed).toBe(true);
        })
    })

    describe('getUserUUID', () => {
        it('should return valid user UUID if user is defined', () => {
            userService.user.set(mockUser);
            expect(userService.getUserUUID()).toEqual('1');
        })
        ;
        it('should return undefined if user is undefined', () => {
            userService.user.set(undefined);
            expect(userService.getUserUUID()).toEqual(undefined);
        });
    });

    describe('isLoggedIn', () => {
        it('should return true if user is defined', () => {
            userService.user.set(mockUser);
            expect(userService.isLoggedIn()).toEqual(true);
        });
        it('should return false if user is undefined', () => {
            expect(userService.isLoggedIn()).toEqual(false);
        })
    });

    describe('loginUser', () => {
        it('should call findUser with given username', () => {
            const findUserSpy = jest.spyOn(userService, 'findUser');
            userService.loginUser('test_user', 'test_pass');
            httpTestingController.expectOne(API_URL_USER + 'test_user');
            expect(findUserSpy).toHaveBeenCalledWith('test_user')
        })
        it('login if user is found and password valid', () => {
            const findUserSpy = jest.spyOn(userService, 'findUser').mockReturnValue(of(mockUser));
            userService.loginUser(mockUser.username, mockUser.password);
            expect(userService.user()).toEqual(mockUser);
            findUserSpy.mockRestore();
        })
        it('dont login if user is not found or password invalid', () => {
            const findUserSpy = jest.spyOn(userService, 'findUser').mockReturnValue(of(undefined));
            userService.loginUser(mockUser.username, mockUser.password);
            expect(userService.user()).toEqual(undefined);
            findUserSpy.mockRestore();
        })
    })

    describe('logoutUser', () => {
        it('should set user to undefined', () => {
            userService.user.set(mockUser);
            userService.logoutUser();
            expect(userService.user()).toEqual(undefined);
        });
        it('should return true if successful', () => {
            userService.user.set(mockUser);
            expect(userService.logoutUser()).toEqual(true);
        });
    })

    describe('findUser', () => {
        const username = 'test_username';

        it('should return Observable<TUser> if user found', () => {
            const observable = userService.findUser(username);
            subscription = observable.subscribe(
                user => expect(user).toEqual(mockUser)
            )
            const request = httpTestingController.expectOne(API_URL_USER + username)
            expect(request.request.method).toBe('GET')
            request.flush(mockUser);
        });
        it('should return Observable<undefined> if user not found', () => {
            const observable = userService.findUser(username);
            subscription = observable.subscribe(
                user => expect(user).toEqual(undefined)
            )
            const request = httpTestingController.expectOne(API_URL_USER + username)
            expect(request.request.method).toBe('GET')
            request.flush({})
        })
    })

    describe('editUserAddress', () => {
        it('should call updateUser with the edited address user', () => {
            userService.user.set(mockUser);
            userService.editUserAddress(2, "test address edit");

            const updatedUser: TUser = {
                uuid: '1',
                username: 'test_user',
                password: 'test_pass',
                email: '',
                address_list: ['test1', 'test2', 'test address edit']
            }
            httpTestingController.expectOne(API_URL_USER + mockUser.uuid);
            expect(updateUserSpy).toHaveBeenCalledWith(updatedUser);
        })
    })

    describe('addUserAddress', () => {
        it('should add address and call updateUser', () => {
            userService.user.set(mockUser);
            userService.addUserAddress("test address");

            const updatedUser: TUser = {
                uuid: '1',
                username: 'test_user',
                password: 'test_pass',
                email: '',
                address_list: ['test1', 'test2', 'test address']
            }
            httpTestingController.expectOne(API_URL_USER + mockUser.uuid);
            expect(updateUserSpy).toHaveBeenCalledWith(updatedUser);
        })
    })

    describe('deleteUserAddress', () => {
        it('should call updateUser with removed address user object', () => {
            userService.user.set(mockUser);

            const updatedUser: TUser = {
                uuid: '1',
                username: 'test_user',
                password: 'test_pass',
                email: '',
                address_list: ['test2']
            }

            userService.deleteUserAddress(0);
            httpTestingController.expectOne(API_URL_USER + mockUser.uuid);
            expect(updateUserSpy).toHaveBeenCalledWith(updatedUser);
        })
        it ('should not call updateUser if is the users only address', () => {

            mockUser = {
                uuid: '1',
                username: 'test_user',
                password: 'test_pass',
                email: '',
                address_list: ['test1']
            }

            userService.user.set(mockUser);
            userService.deleteUserAddress(0);
            expect(updateUserSpy).not.toHaveBeenCalled();
            
        })
    })

    describe('updateUser', () => {
        it('should make a http patch request with the provided user object', () => {
            userService.updateUser(mockUser);
            const request = httpTestingController.expectOne(API_URL_USER + mockUser.uuid)
            const user = request.request.body.user;
            expect(request.request.method).toBe('PATCH');
            expect(user).toEqual(mockUser);
        })
        it('should set the user', async () => {
            userService.updateUser(mockUser);
            const request = httpTestingController.expectOne(API_URL_USER + mockUser.uuid)
            request.flush({});
            expect(userService.user()).toEqual(mockUser)
        })
    })

    describe('registerUser', () => {
        const form: TUserRegisterForm = {
            username: 'test_user',
            password: 'test_pass',
            email: 'test@mail',
            address: 'testaddress'
        };
        it('should make a http post request with the provided form (TUser) as a body', () => {
            userService.registerUser(form)
            const request = httpTestingController.expectOne(API_URL_USER);
            const user: TUser = request.request.body.user;

            expect(request.request.method).toBe('POST');

            expect(user.username).toBe(form.username);
            expect(user.password).toBe(form.password);
            expect(user.email).toBe(form.email);
            expect(user.address_list).toEqual([form.address]);
        })
    })
    
})