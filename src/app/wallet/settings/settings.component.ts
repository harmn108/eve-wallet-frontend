import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { PrivateKeyDialog } from '../../core/private-key/private-key.component';
import { RecoveryPhraseDialog } from '../../core/recovery-phrase/recovery-phrase.component';
import { AccountService } from '../../core/services/account.service';
import { Web3Service } from '../../core/services/web3.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit{
  account;
  privateKey:string;
  brainKey:string;
	constructor(private web3:Web3Service,
              public dialog: MatDialog,
              private accountService: AccountService,
              private snackBar: MatSnackBar) {

  }
  
  ngOnInit(){
    this.account = this.accountService.accountInfo;
    this.privateKey = this.web3.account.privateKey;
    this.brainKey= this.accountService.brainKeyEncrypted;
  }

	backupPrivateKey() {
		const dialogRef = this.dialog.open(PrivateKeyDialog, {
  		width: '870px',
  		panelClass: 'wallet-dialog'
  	});
	}

  backupRecoveryPhrase() {
    const dialogRef = this.dialog.open(RecoveryPhraseDialog, {
      width: '870px',
      panelClass: 'wallet-dialog'
    });
  }

  copy(){
    var input = document.createElement('input');
    input.setAttribute('value', this.account.address);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    //snackbar open

    this.snackBar.open('Copied!', null, {duration: 1000});
  }
}
