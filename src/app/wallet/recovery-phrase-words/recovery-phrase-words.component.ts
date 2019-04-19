import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-recovery-phrase-words',
  templateUrl: './recovery-phrase-words.component.html',
  styleUrls: ['./recovery-phrase-words.component.scss']
})
export class RecoveryPhraseWordsComponent implements OnInit{
  numberArray = [];
  brainKey;
  word1:FormControl = new FormControl();
  word2:FormControl = new FormControl();
  word3:FormControl = new FormControl();
  word4:FormControl = new FormControl();

	constructor(private accountService:AccountService, public router:Router, public dialog: MatDialog) {

  }
  ngOnInit(){
    this.generateNumbers();
    this.brainKey = this.accountService.decryptedBrainKey;
  }

  generateNumbers(){
    let push = true;
    for(let i=0; i<=3 ;i++){
      let random = Math.floor(Math.random()*12+1);
      for(let j =0; j<this.numberArray.length;j++){
        if(random == this.numberArray[j]){
          push = false;
        }
      }
      if(push){
        this.numberArray.push(random);
      }
    }
  }

  finish(){
    let brainKeyArray = this.brainKey.split(' ');
    console.log(brainKeyArray);
    if(brainKeyArray[this.numberArray[0]] == this.word1.value && 
      brainKeyArray[this.numberArray[1]] == this.word2.value && 
      brainKeyArray[this.numberArray[2]] == this.word3.value && 
      brainKeyArray[this.numberArray[3]] == this.word4.value 
    ){
      console.log(true);
    }
  }
}
