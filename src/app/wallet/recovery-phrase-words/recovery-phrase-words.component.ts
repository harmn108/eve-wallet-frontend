import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recovery-phrase-words',
  templateUrl: './recovery-phrase-words.component.html',
  styleUrls: ['./recovery-phrase-words.component.scss']
})
export class RecoveryPhraseWordsComponent implements OnInit, OnDestroy{
  numberArray = [];
  brainKey;
  word1:FormControl = new FormControl();
  word2:FormControl = new FormControl();
  word3:FormControl = new FormControl();
  word4:FormControl = new FormControl();
  setBrainKeySubscription: Subscription;
  phraseError:boolean = false;

	constructor(
    private accountService:AccountService, public router:Router, public dialog: MatDialog) {

  }
  ngOnInit(){
    this.generateNumbers();
    this.brainKey = this.accountService.brainKey;
    if(!this.brainKey){
      this.router.navigate(['/wallet/settings']);
    }
    this.setBrainKeySubscription = this.accountService.brainKeySavedDataChanged.subscribe(data => {
      this.router.navigate(['/wallet/settings']);
  });
  }

  generateNumbers(){
      for(let i = 0;i<4;i++){
        let randomNumber = Math.round(Math.random()*11+1)
        if( this.numberArray.indexOf(randomNumber) == -1){
          this.numberArray.push(randomNumber)
        }else{
          i--
        }
      }
  }

  finish(){
    let brainKeyArray = this.brainKey.split(' ');
    if(brainKeyArray[this.numberArray[0]-1] == this.word1.value && 
      brainKeyArray[this.numberArray[1]-1] == this.word2.value && 
      brainKeyArray[this.numberArray[2]-1] == this.word3.value && 
      brainKeyArray[this.numberArray[3]-1] == this.word4.value 
    ){
      this.accountService.setBrainKeySaved();
      this.accountService.brainKey = '';
    }
    else{
      this.phraseError = true;
    }
  }

  ngOnDestroy(){
    this.accountService.brainKey = '';
  }
}
