import { HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import { Router } from '@angular/router';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('jwtToken');

    // if (req.url.includes('auth/token/refresh')) {
    //     const refreshToken = sessionStorage.getItem('jwtRefreshToken');
    //     if (refreshToken) {
    //         const request = req.clone({setHeaders: { Authorization: `${refreshToken}` } });
    //         return next(request);
    //     }
    //     return throwError(() => new Error('there is no refresh token to send'));
    // }
    
    if (token) {
        const newReq = req.clone({setHeaders: { Authorization: `${token}` } });
        return next(newReq);
        
        // return next(newReq).pipe(
        //     catchError((error: HttpErrorResponse) => {
        //         if (error.status === 401) {
        //             // try and refresh the token
        //             const request = new HttpRequest('GET', AUTH_API + 'token/refresh');


        //             // if failed throwError
        //             // if success retry next(request)
        //         } 
        //         // No interception for other errors, handle as normal
        //         return throwError(() => error);
        //     }) 
        // );
    }
    return next(req);
};


