import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

    const token = localStorage.getItem('jwtToken');

    if (token) {
        const tokenReq = req.clone({setHeaders: { Authorization: `${token}` } });
        return next(tokenReq);
    }

    return next(req);
    
};
