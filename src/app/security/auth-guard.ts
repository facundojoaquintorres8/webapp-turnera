import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../component/toast/toast.service';
import { checkPermission } from './check-permissions';

@Injectable()
export class AuthGuard  {

    constructor(private router: Router, private authService: AuthService, private toastService: ToastService) { }

    canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {
        if (!this.authService.getToken()) {
            this.toastService.changeMessage(
                {
                    showErrorToast: true,
                    errorMessage: 'Sesión expirada.',
                }
            );
            this.router.navigate(['login']);
            return false;
        }

        const permissions = activatedRouteSnapshot.data['permissions'];

        if (permissions && !checkPermission(this.authService.getPermissions(), permissions)) {
            this.toastService.changeMessage(
                {
                    showErrorToast: true,
                    errorMessage: 'No tiene permisos.',
                }
            );
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}