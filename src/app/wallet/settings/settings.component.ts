import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PrivateKeyDialog } from '../../core/private-key/private-key.component';
import { RecoveryPhraseDialog } from '../../core/recovery-phrase/recovery-phrase.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
	constructor(public dialog: MatDialog) {

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
}
