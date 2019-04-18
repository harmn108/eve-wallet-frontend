import {Inject, Injectable, Output, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {isPlatformBrowser} from '@angular/common';
import {ErrorService} from './error.service';
import {Router} from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class AccountService {

    accountInfo: any = null;

    public userUrl = `${environment.backend}/api/user`;
    account: Account;
    balance:number;
    balanceChanged = new Subject();
    accountChanged = new Subject<Account>();
    loginData: any;
    loginDataChanged = new Subject<any>();
    logoutData: any;
    logoutDataChanged = new Subject<any>();
    authenticateData: any;
    authenticateDataChanged = new Subject<any>();

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
                private http: HttpClient,
                private errorService: ErrorService,
                private router: Router) {
    }
  
    public getBalance() {
        return this.balance;
    }

    public unsetBalance() {
        this.balance = 0;
        this.balanceChanged.next(0);
    }

    public loadBalance(): void {
     
    }

    preRegister(email: string): void {
       
    }

    register(password: string): void {
        
    }


    sendRecoverEmail(email: string): void {
        if (isPlatformBrowser(this.platformId)) {
           
        }
    }

   
    getAuthenticateData() {
        //return this.resForStep2Data ? this.resForStep2Data : '';
    }

    authenticate(email: string): void {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + `/signin/authenticate/${email}`;
            this.http.get(url)
                .subscribe(data => {
                    this.authenticateData = data;
                    this.authenticateDataChanged.next(this.authenticateData);
                }, error => this.errorService.handleError('authenticate', error, url));
        }
    }

    login(email: string, password: string, resForStep2) {
        if (isPlatformBrowser(this.platformId)) {
            
        }
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
          
        }
    }

  

    setBrainKeySeen() {
       
    }

    setPrivateKeySaved() {
       
    }

    loggedIn() {
        return this.accountInfo != null;
    }

}
