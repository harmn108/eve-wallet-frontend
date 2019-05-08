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
    public recoverAccount;
    public accountUpdated: BehaviorSubject<any> = new BehaviorSubject(null);
    public brainKey: string;
    public publicKey = '';
    public brainKeyEncrypted = '';
    public userUrl = `${environment.backend}/api/user`;
    public code = '';
    account: Account;
    balance: number;

    balanceChanged = new BehaviorSubject(null);
    accountChanged = new Subject<Account>();
    ethBalance = new Subject<number>();
    transactions: any = [];

    evegTransactionsChanged = new BehaviorSubject(null);
    eveoTransactionsChanged = new BehaviorSubject(null);

    loginData: any;
    loginDataChanged = new Subject<any>();

    loginSessionData: any;
    loginSessionDataChanged = new Subject<any>();

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
    brainKeySavedDataChanged = new Subject<any>();

    recoverDataChanged = new Subject<any>();
    etherBalance;
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private http: HttpClient,
        private errorService: ErrorService,
        private web3: Web3Service,
        private router: Router) {
    }


    public unsetBalance() {
        this.balance = 0;
        this.balanceChanged.next(0);
    }

    public getBalance(): void {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + '/balance';
            this.http.get(url, { headers: new HttpHeaders({ 'X-API-TOKEN': this.accountInfo.token }) }).subscribe(data => {
                this.balanceChanged.next(data);
            }, error => console.log(error));
        }
    }

    getEvegTransactions(hash = null) {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + `/transactions/${environment.eveg_contract_address}/4/${hash}`;
            this.http.get(url, { headers: new HttpHeaders({ 'X-API-TOKEN': this.accountInfo.token }) }).subscribe((data: any) => {
                this.evegTransactionsChanged.next(data);
            }, error => console.log(error));
        }
    }

    getEveoTransactions(hash = null) {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + `/transactions/${environment.eveo_contract_address}/4/${hash}`;
            this.http.get(url, { headers: new HttpHeaders({ 'X-API-TOKEN': this.accountInfo.token }) }).subscribe((data: any) => {
                this.eveoTransactionsChanged.next(data);
            }, error => console.log(error));
        }
    }

    addPendingTransaction(hash: string) {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + `/add-transaction/${hash}`;
            this.http.post(url, {hash}, { headers: new HttpHeaders({ 'X-API-TOKEN': this.accountInfo.token, 'hash': hash }) }).subscribe((data: any) => {

            }, error => console.log(error));
        }
    }


    getSettings() {
        let url = this.userUrl + `/gas-price`;
        return this.http.get(url);
    }

    getDecimals() {
        let url = this.userUrl + `/decimal-places`;
        return this.http.get(url);
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
                    // this.openApp('eve://everyone.bz/user/confirmation/' + code);
                }, error => {
                    this.errorService.handleError('loadConfirm', error, url)
                });
        }
    }
    openApp(url) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.location.href = `${url}`;
        }
    }
    preRegister(email: string): void {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + '/signup';
            this.http.put(url, { email }).subscribe(data => {
                localStorage.setItem('email', email);
                this.preRegisterData = data;
                this.preRegisterDataChanged.next(this.preRegisterData);
            }, error => this.errorService.handleError('preRegister', error, url));
        }
    }

    register(password: string): void {
        if (isPlatformBrowser(this.platformId)) {
            let account = this.web3.create()
            this.brainKey = account.mnemonic;
            this.brainKeyEncrypted = CryptService.brainKeyEncrypt(this.brainKey, password);
            let privateKey = account.privateKey;
            this.publicKey = account.publicKey;
            let signedString = this.web3.hashToSign("" + this.stringToSign, privateKey);
            let url = this.userUrl + '/signup/complete';
            this.http.post(url, {
                confirmationCode: this.code,
                brainKey: this.brainKeyEncrypted,
                publicKey: this.publicKey,
                signedString,
                address: account.address,
            }).map(userInfo => {
                this.accountInfo = userInfo;
                this.accountInfo.brainKey = this.brainKeyEncrypted;
                this.accountUpdated.next(this.accountInfo);
                localStorage.setItem('authToken', this.accountInfo.token);
                if (!this.authenticateData) {
                    this.authenticate(this.accountInfo.email);
                }
                this.getEthBalance();
                this.getBalance();
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


    recoverAuth(pbk) {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + `/recover/authenticate/${pbk}`;
            return this.http.get(url);
        }
    }


    recover(password) {
        if (isPlatformBrowser(this.platformId)) {
            let account = this.recoverAccount;
            this.brainKey = account.mnemonic;
            this.brainKeyEncrypted = CryptService.brainKeyEncrypt(this.brainKey, password);
            let privateKey = account.privateKey;
            this.publicKey = account.publicKey;
            let signedString = this.web3.hashToSign("" + this.stringToSign, privateKey);
            let url = this.userUrl + '/recover/complete';
            this.http.post(url, {
                brainKey: this.brainKeyEncrypted,
                publicKey: this.publicKey,
                signedString,
            }).map((userInfo: any) => {
                localStorage.setItem('email', userInfo.email);
                this.accountInfo = userInfo;
                this.accountInfo.brainKeyEncrypted = this.brainKeyEncrypted;
                this.accountUpdated.next(this.accountInfo);
                return this.accountInfo;
            })
                .subscribe(data => {
                    this.recoverAccount = {};
                    localStorage.setItem('authToken', this.accountInfo.token);
                    this.getBalance();
                    console.log('address', this.accountInfo.address);
                    this.getEthBalance();
                    this.recoverDataChanged.next(data);
                }, error => this.errorService.handleError('login', error, url));
        }
    }


    login(email: string, password: string, resForStep2) {
        if (isPlatformBrowser(this.platformId)) {
            let privateKey;
            let signedString;
            this.brainKeyEncrypted = resForStep2.brainKey ? resForStep2.brainKey : '';
            let url = this.userUrl + '/signin/get-token';
            try {
                let bk = CryptService.brainKeyDecrypt(resForStep2.brainKey, password);
                let canBackup = this.web3.backup(bk);
                if (canBackup) {
                    this.publicKey = canBackup.publicKey;
                    privateKey = canBackup.privateKey;
                    signedString = this.web3.hashToSign('' + resForStep2.stringToSign, privateKey);
                    if (isPlatformBrowser(this.platformId)) {
                        this.http.post(url, { email, signedString })
                            .map((userInfo: any) => {
                                localStorage.setItem('email', email);
                                this.accountInfo = userInfo;
                                this.accountInfo.email = email;
                                this.accountInfo.brainKeyEncrypted = this.brainKeyEncrypted;
                                this.accountUpdated.next(this.accountInfo);
                                return this.accountInfo;
                            })
                            .subscribe(data => {
                                localStorage.setItem('authToken', this.accountInfo.token);
                                this.getBalance();
                                this.getEthBalance();
                                this.loginData = data;
                                this.loginDataChanged.next(this.loginData);
                            }, error => this.errorService.handleError('login', error, url));
                    }
                }
                else {
                    this.errorService.handleError('login', { 'status': 404 }, url);
                }
            } catch (MalformedURLException) {
                this.errorService.handleError('login', { 'status': 404 }, url);
            }
        }
    }

    loginSession(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        // if accountData is present, do not login again
        if (this.accountInfo) {
            return;
        }
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            this.errorService.handleError('loginSession', {
                status: 409,
                error: { message: 'invalid_session_id' }
            });
        }
        const url = this.userUrl;
        this.http
            .get(url, { headers: new HttpHeaders({ 'X-API-TOKEN': authToken }) })
            .map((userInfo: any) => {
                this.accountInfo = userInfo;
                this.accountInfo.token = authToken;
                this.brainKeyEncrypted = userInfo.brainKey;
                this.accountInfo.brainKeyEncrypted = this.brainKeyEncrypted;
                this.accountUpdated.next(this.accountInfo);
                this.publicKey = userInfo.publicKey;
                this.getBalance();
                this.getEthBalance();
                return userInfo;
            })
            .subscribe(
                data => {
                    this.loginSessionData = data;
                    this.loginSessionDataChanged.next(this.loginSessionData);
                },
                error => this.errorService.handleError('loginSession', error, url)
            );

    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            let url = this.userUrl + '/signout';
            this.http.post(url, '', { headers: new HttpHeaders({ 'X-API-TOKEN': this.accountInfo.token }) }).subscribe(data => {
                this.accountUpdated.next(null);
                this.accountInfo = null;
                this.publicKey = '';
                this.brainKey = '';
                this.unsetBalance();
                this.brainKeyEncrypted = '';
                this.logoutData = data;
                localStorage.removeItem('email');
                localStorage.removeItem('authToken');
                this.logoutDataChanged.next(this.logoutData);
                // this.wsService.destroyWebSocket();
            }, error => this.errorService.handleError('logout', error, url));
        }
    }



    setBrainKeySeen() {

    }

    getEthBalance() {
        this.web3.getEthBalance(this.accountInfo.address).then(
            (res: any) => {
                this.ethBalance.next(res / (Math.pow(10, 18)));
                this.etherBalance = res / (Math.pow(10, 18))
            }
        );
    }

    setPrivateKeySaved() {
        let url: string = this.userUrl + '/private-key-saved';
        this.http.post(url, '', { headers: new HttpHeaders({ 'X-API-TOKEN': this.accountInfo.token }) }).subscribe(data => {
            this.accountInfo.privateKeySaved = true;
            this.accountUpdated.next(this.accountInfo);
            this.privateKeySavedDataChanged.next(data);
        }, error => this.errorService.handleError('setPrivateKeySaved', error, url));
    }

    setBrainKeySaved() {
        let url: string = this.userUrl + '/brain-key-saved';
        this.http.post(url, '', { headers: new HttpHeaders({ 'X-API-TOKEN': this.accountInfo.token }) }).subscribe(data => {
            this.accountInfo.brainKeySaved = true;
            this.accountUpdated.next(this.accountInfo);
            this.brainKeySavedDataChanged.next(data);
        }, error => this.errorService.handleError('setBrainKeySaved', error, url));
    }

    loggedIn() {
        return this.accountInfo != null;
    }

}
