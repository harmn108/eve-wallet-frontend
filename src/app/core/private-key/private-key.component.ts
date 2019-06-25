import { Component, OnInit, Inject } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SettingsComponent } from '../../wallet/settings/settings.component';
import { CryptService } from '../services/crypt.service';
import { Web3Service } from '../services/web3.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-private-key-dialog',
  templateUrl: './private-key.component.html',
  styleUrls: ['./private-key.component.scss']
})
export class PrivateKeyDialog implements OnInit{
  backup:boolean = false;
  privateKey:string;
  seenControl:FormControl = new FormControl(false);
  privateKeySavedDataChangedSubscription: Subscription;
  password:FormControl = new FormControl();
  passwordVerified:boolean = false;
  passError:boolean = false;
    constructor(
      private dialogRef: MatDialogRef<SettingsComponent>,
      private accountService: AccountService,
      private web3:Web3Service,
      @Inject(MAT_DIALOG_DATA) public data:any,
      public translateService:TranslateService,
      private snackBar: MatSnackBar) {

    }

    ngOnInit(){ 
      this.backup = this.data.backup;
      this.privateKeySavedDataChangedSubscription = this.accountService.privateKeySavedDataChanged.subscribe(data => {
        this.privateKey =''; 
        this.dialogRef.close();
      });
    }

    confirm(){
      this.accountService.setPrivateKeySaved();
    }

    continue(){
      if(CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted,this.password.value)){
        let brainKey = CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted,this.password.value);
        this.passwordVerified = true;
        this.passError = false;
        this.privateKey = this.web3.backup(brainKey).privateKey;
      }
      else{
        this.passError = true;
      }
    }

    copy(){
      var input = document.createElement('input');
      input.setAttribute('value', this.privateKey);
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      //snackbar open

      this.snackBar.open(this.translateService.instant('wallet.copied'), null, {duration: 1000});
    }

    close(){
      this.dialogRef.close();
    }

    ngOnDestroy() {
      this.privateKey ='';
      this.privateKeySavedDataChangedSubscription && this.privateKeySavedDataChangedSubscription.unsubscribe();
  }
}
