import { Inject, Injectable, Output, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';
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
    balance: number;

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

    privateKeySavedDataChanged = new Subject<any>();
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private http: HttpClient,
        private errorService: ErrorService,
        private web3: Web3Service,
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
            let url = this.userUrl + '/signup';
            this.http.put(url, { email }).subscribe(data => {
                localStorage.setItem('email',email);
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
            let signedString = this.web3.hashToSign(this.stringToSign, privateKey);
            console.log(signedString);
            let url = this.userUrl + '/signup/complete';
            this.http.post(url, {
                confirmationCode: this.code,
                brainKey: this.brainKeyEncrypted,
                publicKey: this.publicKey,
                signedString,
                address: this.web3.account.address,
            }).map(userInfo => {
                this.accountInfo = userInfo;
                this.accountInfo.brainKey = this.brainKeyEncrypted;
                this.accountInfo.pKey = privateKey;
                if (AccountService.isJsonString(this.accountInfo.meta)) {
                    this.accountInfo.meta = JSON.parse(this.accountInfo.meta);
                }
                this.accountUpdated.next(this.accountInfo);
                this.decryptedBrainKey = CryptService.brainKeyDecrypt(this.brainKeyEncrypted, password);
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
            let privateKey;
            let stringHash;
            let signedString;
            this.brainKey = resForStep2.brainKey ? resForStep2.brainKey : '';
            let url = this.userUrl + '/signin/get-token';
            try {
                let bk = CryptService.brainKeyDecrypt(resForStep2.brainKey, password);
                let canBackup = this.web3.backup(bk);
                if(canBackup){
                    privateKey = this.web3.account.privateKey;
                    this.publicKey = this.web3.account.publicKey;
                    signedString = this.web3.hashToSign(''+resForStep2.stringToSign, privateKey);
                    if (isPlatformBrowser(this.platformId)) {
                        this.http.post(url, { email, signedString })
                            .map((userInfo: any) => {
                                localStorage.setItem('email',email);
                                this.accountInfo = userInfo;
                                this.accountInfo.email = email;
                                this.accountInfo.brainKey = this.brainKey;
                                this.accountInfo.pKey = privateKey;
                                if (AccountService.isJsonString(this.accountInfo.meta)) {
                                    this.accountInfo.meta = JSON.parse(this.accountInfo.meta);
                                }
                                if (!this.accountInfo.brainKeySeen) {
                                    this.decryptedBrainKey = bk;
                                }
                                this.accountUpdated.next(this.accountInfo);
                                return this.accountInfo;
                            })
                            .subscribe(data => {
                                this.loginData = data;
                                this.loginDataChanged.next(this.loginData);
                            }, error => this.errorService.handleError('login', error, url));
                    }
                }
                else{
                    this.errorService.handleError('login', { 'status': 404 }, url);
                }
            } catch (MalformedURLException) {
                this.errorService.handleError('login', { 'status': 404 }, url);
            }
        }
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + '/signout';
            this.http.post(url, '', {headers: new HttpHeaders({'X-API-TOKEN': this.accountInfo.token})}).subscribe(data => {
                    this.accountUpdated.next(null);
                    this.accountInfo = null;
                    this.publicKey = '';
                    this.brainKey = '';
                    this.unsetBalance();
                    this.brainKeyEncrypted = '';
                    this.web3.account = {};
                    this.logoutData = data;
                    localStorage.removeItem('email');
                    this.logoutDataChanged.next(this.logoutData);
                    // this.wsService.destroyWebSocket();
                }, error => this.errorService.handleError('logout', error, url));
        }
    }



    setBrainKeySeen() {

    }

    setPrivateKeySaved() {
        let url: string = this.userUrl + '/private-key-saved';
        this.http.post(url, '', {headers: new HttpHeaders({'X-API-TOKEN': this.accountInfo.token})}).subscribe(data => {
            this.accountInfo.privateKeySaved = true;
            this.accountUpdated.next(this.accountInfo);
            this.privateKeySavedDataChanged.next(data);
        }, error => this.errorService.handleError('setPrivateKeySaved', error, url));
    }

    loggedIn() {
        return this.accountInfo != null;
    }

}
