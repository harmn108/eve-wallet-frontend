import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WalletInnerComponent } from '../../wallet/wallet-inner/wallet-inner.component'
import { FormControl } from '@angular/forms';
import { CryptService } from '../services/crypt.service';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-confirm-transaction-dialog',
  templateUrl: './confirm-transaction.component.html',
  styleUrls: ['./confirm-transaction.component.scss']
})
export class ConfirmTransactionDialog {
  password:FormControl = new FormControl();
  passError:boolean = false;
  passwordVerified:boolean = false;
  token:string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private accountService:AccountService, private dialogRef: MatDialogRef<WalletInnerComponent>) {

  }

  continue(){
    if(CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted,this.password.value)){
      let brainKey = CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted,this.password.value);
      this.passError = false;
      this.passwordVerified = true;
      this.token = this.data.token;
    }
    else{
      this.passError = true;
    }
  }

  close() {
  	this.dialogRef.close();
  }
}
