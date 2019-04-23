import {Injectable, PLATFORM_ID, Inject} from '@angular/core';
import {CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { AccountService } from '../services/account.service';
import { Observable, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ErrorService, ErrorEvent } from '../services/error.service';

@Injectable()
export class AuthguardService implements CanActivate, CanActivateChild {

    loginSessionSubscription: Subscription = Subscription.EMPTY;
    errorHandleSubscription: Subscription = Subscription.EMPTY;
    constructor(private router: Router,
                private accountService: AccountService,
                private errorService:ErrorService,
                @Inject(PLATFORM_ID) private platformId: Object,
            ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean> | Promise<boolean> | boolean {
        if (isPlatformBrowser(this.platformId)) {
          return new Promise(resolve => {
            if (this.accountService.loggedIn()) {
              resolve(true);
              return;
            }
    
            const authToken = localStorage.getItem('authToken')
              ? localStorage.getItem('authToken')
              : null;
            if (!authToken) {
              resolve(false);
              this.router.navigate(['/user/login']);
              return;
            } else {
              this.accountService.loginSession();
              this.loginSessionSubscription = this.accountService.loginSessionDataChanged.subscribe(
                () => {
                  resolve(true);
                }
              );
              this.errorHandleSubscription = this.errorService.errorEventEmiter.subscribe(
                (error: ErrorEvent) => {
                  if (error.action === 'loginSession') {
                    resolve(false);
                    this.router.navigate(['/user/login']);
                    return;
                  }
                }
              );
            }
          });
        } else {
          return true;
        }
      }
    
      canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(next, state);
      }
}
