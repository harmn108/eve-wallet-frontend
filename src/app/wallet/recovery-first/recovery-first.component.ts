import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReallyPostponeDialog } from '../../core/really-postpone/really-postpone.component';


@Component({
  selector: 'app-recovery-first-dialog',
  templateUrl: './recovery-first.component.html',
  styleUrls: ['./recovery-first.component.scss']
})
export class RecoveryFirstComponent {
	constructor(public dialog: MatDialog) {}
  
  later() {
  	const dialogRef = this.dialog.open(ReallyPostponeDialog, {
  		width: '870px',
  		panelClass: 'wallet-dialog'
  	});
  }
}
