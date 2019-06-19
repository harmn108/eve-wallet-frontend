import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ConfirmTransactionDialog } from '../../core/confirm-transaction/confirm-transaction.component';
import { TokenService } from '../../core/services/token.service';
import { AccountService } from '../../core/services/account.service';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment.prod';
import { ErrorService } from '../../core/services/error.service';
import * as moment from 'moment';
import { Web3Service } from '../../core/services/web3.service';
import { TranslateService } from '@ngx-translate/core';
import { interval, of, ReplaySubject, Subject } from 'rxjs';

import { Decimal } from 'decimal.js';
import { delay, switchMap, take, takeUntil, tap } from 'rxjs/operators';


@Component({
    selector: 'app-wallet-inner',
    templateUrl: './wallet-inner.component.html',
    styleUrls: ['./wallet-inner.component.scss']
})
export class WalletInnerComponent implements OnInit, OnDestroy {
    token: string = 'eveg';
    address: string;
    transferForm: FormGroup;
    transactions;
    mobile = false;
    evegTransactions = [];
    eveoTransactions = [];
    evegBalance;
    eveoBalance;
    balance;
    decimals;
    coinPrecision = 8;
    amountErrorMessage = '';
    transferFee = 0;
    invalidAddress: boolean = false;
    settings;
    seeMorebool: boolean = false;
    clickSeeMoreEveo: boolean = false;
    clickSeeMoreEveg: boolean = false;
    lastEveg: boolean = false;
    lastEveo: boolean = false;
    ethBalance;
    ethFee: any = 0;
    time: any;
    pendingError = false;
    tSubmitted = false;
    gasPriceError = false;
    addressError = false;
    amountError = false;
    estFee;
    private _updateTransactions$ = new Subject<void>();

    private _unsubscribe$ = new ReplaySubject<void>(1);

    constructor(private accountService: AccountService,
        private FormBuilder: FormBuilder,
        private web3: Web3Service,
        public translateService: TranslateService,
        public dialog: MatDialog,
        private tokenService: TokenService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private errorService: ErrorService,
        private snackBar: MatSnackBar) {

    }

    formatLabel(value: number | null) {
        if (!value) {
            return 0;
        }

        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }

        return value;
    }

    ngOnInit() {
        this.buildForm();
        if (isPlatformBrowser(this.platformId)) {
            this.mobile = window.innerWidth < 767;
            window.addEventListener('resize', () => {
                this.mobile = window.innerWidth < 767;
            });
            if (!this.accountService.etherBalance) {
                this.accountService.getEthBalance();
            }
            this.accountService.ethBalance.subscribe(
                (eth: any) => {
                    this.ethBalance = parseFloat(eth);
                    this.accountService.getSettings().subscribe(
                        settings => {
                            this.settings = settings['price'];
                            this.time = settings['time'];
                            this.transferForm.controls['gasPrice'].setValue((this.settings.max + this.settings.min) / 2);
                            if (this.settings.min == this.settings.average && this.settings.average == this.settings.max) {
                                this.settings = {
                                    min: this.settings.min,
                                    average: this.settings.average * 1.1,
                                    max: this.settings.max * 1.2
                                }
                            }
                            this.ethFee = Decimal.div(this.settings.average, 10e8);
                        }
                    );
                }
            );




            // let data = {
            //     from: this.accountService.accountInfo.address,
            //     to: this.transferParams.contractAddress,
            //     gas: 10000,//this.web3.utils.toHex(this.settings.gas),
            //     gasPrice:this.transferParams.gasPrice,
            //     amount:this.transferParams.amount,
            //     toAddress:this.transferParams.address,
            //     decimalPlaces:this.data.decimalPlaces
            // };
            // this.web3.estimateGas(data);

            this.transferForm.valueChanges.subscribe(
                val => {
                    let gasPrice = val.gasPrice;
                    if (this.settings) {
                        if (gasPrice !== this.settings.min && gasPrice !== this.settings.max) {
                            gasPrice = this.settings.average;
                        }
                        if (this.transferForm.valid) {
                            const data = {
                                from: this.accountService.accountInfo.address,
                                to: this.token == 'eveg' ? environment.eveg_contract_address : environment.eveo_contract_address,
                                gasPrice: gasPrice,
                                amount: this.transferForm.value.amount,
                                toAddress: this.transferForm.value.address,
                                decimalPlaces: this.token == 'eveg' ? this.decimals[environment.eveg_contract_address] : this.decimals[environment.eveo_contract_address]
                            };
                            this.web3.estimateGas(data).then(
                                res => {
                                    this.estFee = gasPrice * (res / 1e9 );
                                }
                            ).catch(
                                err => this.estFee = null
                            ) ;
                        }
                        else {
                            this.estFee = null;
                        }
                    }
                    }
            );



            this.tokenService.active.subscribe(
                token => {
                    this.transferForm.controls['amount'].reset();
                    this.amountErrorMessage = '';
                    this.token = token;
                }
            );
            this.accountService.balanceChanged.subscribe(
                res => {
                    if (res) {
                        this.balance = res.balance;
                        this.evegBalance = this.balance[environment.eveg_contract_address];
                        this.eveoBalance = this.balance[environment.eveo_contract_address];
                    }
                }
            );
            this.accountService.eveoTransactionsChanged.subscribe(
                res => {
                    if (res) {
                        this.seeMorebool = false;
                        if (this.clickSeeMoreEveo) {
                            this.eveoTransactions = this.eveoTransactions.concat(res.transactions);
                        }
                        else {
                            this.eveoTransactions = res.transactions;
                        }
                        this.lastEveo = res.more;
                    }
                }
            );
            this.accountService.evegTransactionsChanged
                .subscribe(
                    res => {
                        if (res) {
                            this.seeMorebool = false;
                            if (this.clickSeeMoreEveg) {
                                this.evegTransactions = this.evegTransactions.concat(res.transactions);
                            }
                            else {
                                this.evegTransactions = res.transactions;
                            }
                            this.lastEveg = res.more;
                        }
                    }
                );

            this.accountService.getDecimals().subscribe(
                decimals => {
                    this.decimals = decimals;
                }
            );
            this.address = this.accountService.accountInfo.address;
        }

        this._updateTransactions$.pipe(
            switchMap(() => interval(10000).pipe(
                tap(() => {
                    this.accountService.getEveoTransactions();
                    this.accountService.getEvegTransactions();
                })
            )),
            takeUntil(this._unsubscribe$)
        ).subscribe()

    }

    fillMax() {
        if (this.token === 'eveg'){
            this.transferForm.controls['amount'].setValue(this.evegBalance)
        } else {
            this.transferForm.controls['amount'].setValue(this.eveoBalance)
        }
    }

    updateFee(e) {
        let p = e.value;
        if (p !== this.settings.min && p !== this.settings.max) {
            p = this.settings.average;
        }
        this.ethFee = Decimal.div(p, 10e8);
    }

    ifNumber(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
            return false;
        }
        return true;
    }

    copy() {
        let textarea = null;
        const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        try {
            textarea = document.createElement('textarea');
            textarea.style.height = '0px';
            textarea.style.left = '-100px';
            textarea.style.opacity = '0';
            textarea.style.position = 'fixed';
            textarea.style.top = '-100px';
            textarea.style.width = '0px';
            document.body.appendChild(textarea);
            textarea.value = this.address;
            if (iOS) {
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(textarea);
                selection.removeAllRanges();
                selection.addRange(range);
                textarea.setSelectionRange(0, 999999);
            } else {
                textarea.select();
            }
            document.execCommand('copy');
            this.snackBar.open(this.translateService.instant('wallet.copied'), null, { duration: 5000 });

        } finally {
            if (textarea && textarea.parentNode) {
                textarea.parentNode.removeChild(textarea);
            }
        }

    }

    generateTransaction() {
        this.gasPriceError = false;
        this.addressError = false;
        this.amountErrorMessage = null;
        if (this.checkValidGasPrice(this.transferForm.controls['gasPrice']) && this.checkValidGasPrice(this.transferForm.controls['gasPrice'])['invalidGasPrice']) {
            this.gasPriceError = true;
        }
        if (this.checkValidAddress(this.transferForm.controls['address']) && this.checkValidAddress(this.transferForm.controls['address'])['invalidAddress']) {
            this.addressError = true;
        }
        if (this.validateAmount(this.transferForm.controls['amount']) && this.validateAmount(this.transferForm.controls['amount'])['invalidAmount']) {
            this.amountError = true;
        }
        this.tSubmitted = true;
        if (this.gasPriceError || this.addressError || this.amountErrorMessage) {
            return;
        }
        let gasPrice = this.transferForm.value.gasPrice;
        let transTime = gasPrice === this.settings.min ? this.time.min : gasPrice === this.settings.max ? this.time.max : this.time.average

        if (gasPrice !== this.settings.min && gasPrice !== this.settings.max) {
            gasPrice = this.settings.average;
        }
        this.web3.checkPendingTransactions(this.accountService.accountInfo.address).subscribe(res => {
           if (res[0] !== res[1]) {
              this.pendingError = true;
               return;
           }
            let data = {
                token: this.token,
                amount: this.transferForm.value.amount,
                address: this.transferForm.value.address,
                gasPrice: gasPrice,
                transactionTime: transTime,
                estFee: this.estFee,
                contractAddress: this.token == 'eveg' ? environment.eveg_contract_address : environment.eveo_contract_address,
                decimalPlaces: this.token == 'eveg' ? this.decimals[environment.eveg_contract_address] : this.decimals[environment.eveo_contract_address]
            };
            const dialogRef = this.dialog.open(ConfirmTransactionDialog, {
                width: '870px',
                panelClass: 'wallet-dialog',
                data: data
            });

            dialogRef.afterClosed().subscribe(result => {
                this.transferForm.reset();
                this.tSubmitted = false;
                this.transferForm.controls['gasPrice'].setValue((this.settings.max + this.settings.min) / 2);
                this._updateTransactions$.next();
            });
        });


    }

    transfer() {

    }

    seeMore() {
        if (this.token == 'eveg') {
            this.clickSeeMoreEveg = true;
            this.seeMorebool = true;
            this.accountService.getEvegTransactions(this.evegTransactions[this.evegTransactions.length - 1].transactionHash);
        }
        else {
            this.clickSeeMoreEveo = true;
            this.seeMorebool = true;
            this.accountService.getEveoTransactions(this.eveoTransactions[this.eveoTransactions.length - 1].transactionHash);
        }
    }

    private buildForm() {
        this.transferForm = this.FormBuilder.group({
            'address': new FormControl('', [Validators.required, this.checkValidAddress.bind(this)]),
            'gasPrice': new FormControl(null, [Validators.required]),
            'amount': new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.pattern(/^([0-9]+\.?[0-9]{0,8})$/)
                ],
                updateOn: 'change'
            })
        });
    }

    checkValidAddress(control: AbstractControl) {
        if (control.value && control.value.length) {
            if (this.web3.checkValidAddress(control.value)) {
                return false;
            }
            else {
                return {
                    invalidAddress: true
                };
            }
        } else {
            return {
                invalidAddress: true
            };
        }
    }

    checkValidGasPrice(control: AbstractControl) {
        if (control.value) {
            if ((control.value) / (Math.pow(10, 9)) < this.ethBalance) {
                return false;
            }
            else {
                return {
                    invalidGasPrice: true
                };
            }
        } else {
            return {
                invalidGasPrice: true
            };
        }
    }


    validateAmount(control: AbstractControl) {
        let amount = control.value;
        if (!amount) {
            this.amountErrorMessage = this.errorService.getError('ins_invalid_amount_error');
            return;
        }
        let tmpArr;
        let balance;
        if (this.token == 'eveg') {
            balance = this.evegBalance;
        }
        if (this.token == 'eveo') {
            balance = this.eveoBalance;
        }
        if (amount) {
            tmpArr = amount.split('.');
        }

        if (amount <= 0 || (tmpArr && tmpArr.length == 2 && tmpArr[1].length > 8) || (tmpArr && tmpArr.length > 2)) {
            return {
                invalidAmount: {
                    parsedAmount: amount
                }
            };
        } else if (amount > balance - this.transferFee) {
            this.amountErrorMessage = this.errorService.getError('ins_invalid_amount_error');
            return {
                balanceExceeded: {
                    parsedAmount: amount
                }
            };
        } else {
            this.amountErrorMessage = '';
        }
        return null;
    }

    getHours(time) {
        var hour = moment(new Date(time).getTime()).format('LT');
        return hour;
    }

    getDate(time) {
        var date = moment(new Date(time)).format('D MMM YYYY');
        //   .replace(/^\S+\s/,'');
        return date;
    }

    ngOnDestroy(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();
    }

}
