import { Component, OnInit, Inject } from '@angular/core';
import { AccountService } from '../services/account.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SettingsComponent } from '../../wallet/settings/settings.component';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CryptService } from '../services/crypt.service';

@Component({
  selector: 'app-recovery-phrase-dialog',
  templateUrl: './recovery-phrase.component.html',
  styleUrls: ['./recovery-phrase.component.scss']
})
export class RecoveryPhraseDialog implements OnInit {
  brainKey: string;
  backup: boolean = false;
  passwordVerified: boolean = false;
  password: FormControl = new FormControl();
  passError:boolean = false;
  constructor(
    public router: Router,
    private dialogRef: MatDialogRef<SettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AccountService) {

  }

  ngOnInit() {
    this.backup = this.data.backup;
  }

  continue(){
    if(CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted, this.password.value)){
      this.passError = false;
      this.passwordVerified = true;
      this.brainKey = CryptService.brainKeyDecrypt(this.accountService.brainKeyEncrypted, this.password.value);
    }
    else{
      this.passError = true;
    }
  }

  next() {
    this.dialogRef.close();
    this.accountService.brainKey = this.brainKey;
    this.router.navigate(['/wallet/backup-recovery-phrase']);
  }

  close() {
    this.brainKey = '';
    this.dialogRef.close();
  }

  copy() {
    var input = document.createElement('input');
    input.setAttribute('value', this.brainKey);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    //snackbar open
  }

}
