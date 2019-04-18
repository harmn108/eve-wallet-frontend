import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmTransactionDialog } from '../../core/confirm-transaction/confirm-transaction.component';


@Component({
  selector: 'app-wallet-inner',
  templateUrl: './wallet-inner.component.html',
  styleUrls: ['./wallet-inner.component.scss']
})
export class WalletInnerComponent {
	constructor(public dialog: MatDialog) {}

  generateTransaction() {
  	const dialogRef = this.dialog.open(ConfirmTransactionDialog, {
  		width: '870px',
  		panelClass: 'wallet-dialog'
  	});
  }
}
