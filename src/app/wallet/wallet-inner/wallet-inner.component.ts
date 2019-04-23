import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ConfirmTransactionDialog } from '../../core/confirm-transaction/confirm-transaction.component';
import { TokenService } from '../../core/services/token.service';
import { AccountService } from '../../core/services/account.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment.prod';
import { ErrorService } from '../../core/services/error.service';
import * as moment from 'moment';
import { Web3Service } from '../../core/services/web3.service';
@Component({
  selector: 'app-wallet-inner',
  templateUrl: './wallet-inner.component.html',
  styleUrls: ['./wallet-inner.component.scss']
})
export class WalletInnerComponent implements OnInit {
  token: string = 'eveg';
  address: string;
  transferForm: FormGroup;
  transactions;
  evegTransactions = [];
  eveoTransactions = [];
  evegBalance;
  eveoBalance;
  balance;
  coinPrecision = 8;
  amountErrorMessage = '';
  transferFee = 0.01;
  invalidAddress: boolean = false;
  constructor(private accountService: AccountService,
    private FormBuilder: FormBuilder,
    private web3: Web3Service,
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
      this.tokenService.active.subscribe(
        token => {
          this.token = token;
        }
      );
      this.accountService.evegTransactionsChanged
        .subscribe(
          res => {
            if (res) {
              this.evegTransactions = res;
              console.log(this.evegTransactions);
            }
          }
        )
      this.accountService.balanceChanged.subscribe(
        res => {
          if (res) {
            this.balance = res.balance;
            this.evegBalance = this.balance[environment.eveg_contract_address];
            this.eveoBalance = this.balance[environment.eveo_contract_address];
          }
        }
      )
      this.accountService.eveoTransactionsChanged.subscribe(
        res => {
          if (res) {
            this.eveoTransactions = res;
          }
        }
      )
      this.address = this.accountService.accountInfo.address;
    }
  }

  copy() {
    var input = document.createElement('input');
    input.setAttribute('value', this.address);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    //snackbar open

    this.snackBar.open('Copied!', null, { duration: 1000 });
  }

  generateTransaction() {
    let data = {
      token:this.token,
      amount: this.transferForm.value.amount,
      address: this.transferForm.value.address,
      gasPrice:this.transferForm.value.gasPrice,
    };
    const dialogRef = this.dialog.open(ConfirmTransactionDialog, {
      width: '870px',
      panelClass: 'wallet-dialog',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });

  }

  transfer() {

  }

  private buildForm() {
    this.transferForm = this.FormBuilder.group({
      'address': new FormControl('', [Validators.required, this.checkValidAddress.bind(this)]),
      'gasPrice':new FormControl(20,[Validators.required]),
      'amount': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(/^([0-9]+\.?[0-9]{0,8})$/),
          this.validateAmount.bind(this),
        ],
        updateOn: 'change'
      })
    });
  }

  checkValidAddress(control: FormControl) {
    if (control.value && control.touched) {
      if (this.web3.checkValidAddress(control.value)) {
        return false;
      }
      else {
        return {
          invalidAddress: true
        };
      }
    }

  }


  validateAmount(control: FormControl) {
    let amount = control.value;
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

}
