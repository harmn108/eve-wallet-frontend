import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-recovery-phrase-words',
  templateUrl: './recovery-phrase-words.component.html',
  styleUrls: ['./recovery-phrase-words.component.scss']
})
export class RecoveryPhraseWordsComponent {
	constructor(public dialog: MatDialog) {}
}
