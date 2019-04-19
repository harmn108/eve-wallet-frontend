import {Inject, Injectable, Output, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {isPlatformBrowser} from '@angular/common';
import {ErrorService} from './error.service';
import {Router} from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map';
import { Web3Service } from './web3.service';
import { CryptService } from './crypt.service';

@Injectable()
export class AccountService {

    accountInfo: any = null;
    public stringToSign = '';
    public accountUpdated: BehaviorSubject<any> = new BehaviorSubject(null);
    public brainKey: string;
    public publicKey = '';
    public brainKeyEncrypted = '';
    public decryptedBrainKey = '';
    public userUrl = `${environment.backend}/api/user`;
    public code = '';
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

    preRegisterData: any;
    preRegisterDataChanged = new Subject<any>();

    confirmCode: any;
    confirmCodeChanged = new Subject<any>();

    registerData: any;
    registerDataChanged = new Subject<any>();

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
                private http: HttpClient,
                private errorService: ErrorService,
                private web3:Web3Service,
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

    loadConfirm(code: string): void {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + `/signup/confirmation/${code}`;
            this.http.get(url)
                .subscribe(result => {
                    this.stringToSign = (result && result['stringToSign']) ? result['stringToSign'] : '';
                    this.code = code;
                    this.confirmCode = result;
                    this.confirmCodeChanged.next(result);
                }, error => {
                    this.errorService.handleError('loadConfirm', error, url)
                });
        }
    }

    preRegister(email: string): void {
       if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl+'/signup';
            this.http.put(url, {email}).subscribe(data => {
                this.preRegisterData = data;
                this.preRegisterDataChanged.next(this.preRegisterData);
            }, error => this.errorService.handleError('preRegister', error, url));
        }
    }

    register(password: string): void {
        if (isPlatformBrowser(this.platformId)) {
            this.brainKeyEncrypted = CryptService.brainKeyEncrypt(this.brainKey, password);
            let privateKey = this.web3.account.privateKey;
            this.publicKey = this.web3.account.publicKey;
            let keyHash = CryptService.stringToHash(this.stringToSign);
            let signedString = this.web3.hashToSign(keyHash, privateKey);
            let url = this.userUrl + '/complete';
            this.http.post(url, {
                confirmationCode: this.code, brainKey: this.brainKeyEncrypted,
                publicKey: this.publicKey,
                signedString
            }).map(userInfo => {
                this.accountInfo = userInfo;
                this.accountInfo.brainKey = this.brainKeyEncrypted;
                this.accountInfo.pKey = privateKey;
                if (AccountService.isJsonString(this.accountInfo.meta)) {
                    this.accountInfo.meta = JSON.parse(this.accountInfo.meta);
                }

                this.accountUpdated.next(this.accountInfo);
                CryptService.brainKeyDecrypt(this.brainKeyEncrypted, password).subscribe((brainKey: string) => {
                    this.decryptedBrainKey = brainKey;
                });

                if (!this.authenticateData) {
                    this.authenticate(this.accountInfo.email);
                }

                return this.accountInfo;
            })
                .subscribe(data => {
                this.registerData = data;
                this.registerDataChanged.next(this.registerData);
            }, error => this.errorService.handleError('register', error, url));
        }
    }


    sendRecoverEmail(email: string): void {
        if (isPlatformBrowser(this.platformId)) {
           
        }
    }

    static isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
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
