import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WalletInnerComponent } from '../../wallet/wallet-inner/wallet-inner.component'
import { FormControl } from '@angular/forms';
import { CryptService } from '../services/crypt.service';
import { AccountService } from '../services/account.service';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-confirm-transaction-dialog',
  templateUrl: './confirm-transaction.component.html',
  styleUrls: ['./confirm-transaction.component.scss']
})
export class ConfirmTransactionDialog {
  password:FormControl = new FormControl();
  passError:boolean = false;
  passwordVerified:boolean = false;
  transferParams;
  privateKey:string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private web3:Web3Service,
    private accountService:AccountService, private dialogRef: MatDialogRef<WalletInnerComponent>) {

  }

  continue(){
    if(CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted,this.password.value)){
      let brainKey = CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted,this.password.value);
      this.privateKey = this.web3.backup(brainKey).privateKey;
      if(this.privateKey){
        this.passError = false;
        this.passwordVerified = true;
        this.transferParams = this.data;
        console.log(this.transferParams,this.accountService.accountInfo.address);
      }
      this.passError = true;
    }
    else{
      this.passError = true;
    }
  }

  confirm(){
    //this.web3.sendToken()
  }

  close() {
  	this.dialogRef.close();
  }
}
