import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { SettingsComponent } from '../../wallet/settings/settings.component';

@Component({
  selector: 'app-private-key-dialog',
  templateUrl: './private-key.component.html',
  styleUrls: ['./private-key.component.scss']
})
export class PrivateKeyDialog implements OnInit{
  privateKey:string;
  seenControl:FormControl = new FormControl(false);
  privateKeySavedDataChangedSubscription: Subscription;

    constructor(
      private dialogRef: MatDialogRef<SettingsComponent>,
      private accountService: AccountService,
      private snackBar: MatSnackBar) {

    }

    ngOnInit(){ 
      this.privateKey = this.accountService.accountInfo.pKey;
      this.privateKeySavedDataChangedSubscription = this.accountService.privateKeySavedDataChanged.subscribe(data => {
          this.dialogRef.close();
      });
    }

    confirm(){
      this.accountService.setPrivateKeySaved();
    }

    copy(){
      var input = document.createElement('input');
      input.setAttribute('value', this.privateKey);
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      //snackbar open

      this.snackBar.open('Copied!', null, {duration: 1000});
    }

    ngOnDestroy() {
      this.privateKeySavedDataChangedSubscription && this.privateKeySavedDataChangedSubscription.unsubscribe();
  }
}
