import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';


@Component({
  selector: 'app-recovery-phrase-words',
  templateUrl: './recovery-phrase-words.component.html',
  styleUrls: ['./recovery-phrase-words.component.scss']
})
export class RecoveryPhraseWordsComponent implements OnInit{
  numberArray = [];
	constructor(public router:Router, public dialog: MatDialog) {

  }
  ngOnInit(){
    
  }

  generateNumbers(){
    
  }
}
