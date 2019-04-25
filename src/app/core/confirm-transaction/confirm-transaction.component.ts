import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { WalletInnerComponent } from '../../wallet/wallet-inner/wallet-inner.component'
import { FormControl } from '@angular/forms';
import { CryptService } from '../services/crypt.service';
import { AccountService } from '../services/account.service';
import { Web3Service } from '../services/web3.service';
import { TranslateService } from '@ngx-translate/core';

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
    private accountService:AccountService, private dialogRef: MatDialogRef<WalletInnerComponent>,
    private snackBar:MatSnackBar,
    public translateService:TranslateService
  ) {

  }

  continue(){
    if(CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted,this.password.value)){
      let brainKey = CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted,this.password.value);
      this.privateKey = this.web3.backup(brainKey).privateKey;
      if(this.privateKey){
        this.passError = false;
        this.passwordVerified = true;
        this.transferParams = this.data;
      }
      this.passError = true;
    }
    else{
      this.passError = true;
    }
  }

  confirm(){
    let data = {
      from: this.accountService.accountInfo.address,
      to: this.transferParams.contractAddress,
      gas: 10000,//this.web3.utils.toHex(this.settings.gas),
      gasPrice:this.transferParams.gasPrice,
      amount:this.transferParams.amount,
      toAddress:this.transferParams.address,
      pvk:this.privateKey,
      decimalPlaces:this.data.decimalPlaces
    }
     this.web3.sendToken(data).then(
      res => {
        this.snackBar.open(this.translateService.instant("wallet.will_take_10_sec"), null, { duration: 1000 });
        this.close();
      }
    ).catch(
      err => {
        this.snackBar.open(this.translateService.instant("wallet.something_went_wrong"), null, { duration: 1000 });
        this.close();
    }
    )
  }

  close() {
    this.privateKey = '';
  	this.dialogRef.close();
  }
}
