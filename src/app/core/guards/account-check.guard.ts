import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

@Injectable()
export class AccountCheckGuard implements CanActivate {

    constructor(private router: Router,
        private accountService: AccountService
    ) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (next.queryParams.recover == 'true' && !this.accountService.recoverAccount) {
            this.router.navigate(['/user/login']);
            return false;
        }
        return true
    }
}
