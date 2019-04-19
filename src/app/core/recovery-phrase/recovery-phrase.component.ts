import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-recovery-phrase-dialog',
  templateUrl: './recovery-phrase.component.html',
  styleUrls: ['./recovery-phrase.component.scss']
})
export class RecoveryPhraseDialog implements OnInit{
  brainKey:string;
  constructor(private accountService:AccountService){

  }

  ngOnInit(){
    this.brainKey = this.accountService.brainKeyEncrypted;
  }

  next(){
    
  }
  
}
