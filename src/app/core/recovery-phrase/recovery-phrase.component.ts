import { Component, OnInit, Inject } from '@angular/core';
import { AccountService } from '../services/account.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SettingsComponent } from '../../wallet/settings/settings.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-phrase-dialog',
  templateUrl: './recovery-phrase.component.html',
  styleUrls: ['./recovery-phrase.component.scss']
})
export class RecoveryPhraseDialog implements OnInit{
  brainKey:string;
  backup:boolean = false;
  constructor(
    public router:Router,
    private dialogRef: MatDialogRef<SettingsComponent>,
      @Inject(MAT_DIALOG_DATA) public data:any,
    private accountService:AccountService){

  }

  ngOnInit(){
    this.backup = this.data.backup;
    this.brainKey = this.accountService.decryptedBrainKey;
  }

  next(){
    this.dialogRef.close();
    this.router.navigate(['/wallet/backup-recovery-phrase']);
  }

  close() {
    this.dialogRef.close();
  }

  copy(){
    var input = document.createElement('input');
    input.setAttribute('value', this.brainKey);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    //snackbar open
  }
  
}
